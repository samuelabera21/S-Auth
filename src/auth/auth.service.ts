import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyEmailVerificationToken,
  verifyPasswordResetToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

import { sendVerificationEmail, sendResetPasswordEmail } from "./auth.mail.js";

import { RegisterDto, LoginDto } from "./auth.validation.js";


import { findSessionByRefreshToken } from "./auth.helpers.js";
import { UAParser } from "ua-parser-js";


class AuthService {
  async register(data: RegisterDto) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    });

    const verificationToken =
  generateEmailVerificationToken({
    userId: user.id,
  });

await sendVerificationEmail(
  user.email,
  verificationToken
);

    return user;
  }


async verifyEmail(token: string) {
  const payload =
    verifyEmailVerificationToken(token);

  await prisma.user.update({
    where: {
      id: payload.userId,
    },
    data: {
      emailVerified: true,
    },
  });

  return true;
}


async forgotPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return;
  }

  const token =
    generatePasswordResetToken({
      userId: user.id,
    });

  await sendResetPasswordEmail(
    user.email,
    token
  );
}


async resetPassword(
  token: string,
  password: string
) {
  const payload =
    verifyPasswordResetToken(token);

  const passwordHash =
    await hashPassword(password);

  await prisma.user.update({
    where: {
      id: payload.userId,
    },
    data: {
      passwordHash,
    },
  });

  await prisma.session.updateMany({
    where: {
      userId: payload.userId,
      isRevoked: false,
    },
    data: {
      isRevoked: true,
    },
  });

  await prisma.securityEvent.create({
    data: {
      userId: payload.userId,
      eventType: "PASSWORD_RESET",
    },
  });
}

async login(
  data: LoginDto,
  ipAddress: string,
  userAgent: string
) {

  const fifteenMinutesAgo = new Date(
  Date.now() - 15 * 60 * 1000
);

const failedAttempts = await prisma.loginAttempt.count({
  where: {
    email: data.email,
    ipAddress,
    successful: false,
    createdAt: {
      gte: fifteenMinutesAgo,
    },
  },
});

if (failedAttempts >= 5) {
  throw new Error(
    "Too many failed login attempts. Please try again in 15 minutes."
  );
}
  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  // Prevent user enumeration
if (!user || !user.passwordHash) {
  await prisma.loginAttempt.create({
    data: {
      email: data.email,
      ipAddress,
      successful: false,
    },
  });

  throw new Error("Invalid email or password");
}

  // Compare password
  const passwordMatches = await comparePassword(
    data.password,
    user.passwordHash
  );

if (!passwordMatches) {
  await prisma.loginAttempt.create({
    data: {
      email: data.email,
      ipAddress,
      successful: false,
      userId: user.id,
    },
  });

  throw new Error("Invalid email or password");
}

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  // Hash refresh token before saving
  const refreshTokenHash = await hashPassword(refreshToken);


const parser = new UAParser(userAgent);

const browser = parser.getBrowser().name || "Unknown";
const os = parser.getOS().name || "Unknown";
const device =
  parser.getDevice().model ||
  parser.getDevice().type ||
  "Desktop";



  const existingDevice = await prisma.session.findFirst({
  where: {
    userId: user.id,
    browser,
    os,
    device,
    isRevoked: false,
  },
});

  // Create session
 const session = await prisma.session.create({
  data: {
    userId: user.id,
    refreshTokenHash,

    ipAddress,
    browser,
    os,
    device,

    expiresAt: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ),
  },
});

await prisma.securityEvent.create({
  data: {
    userId: user.id,
    eventType: "LOGIN_SUCCESS",
    ipAddress,
    device,
  },
});

if (!existingDevice) {
  await prisma.securityEvent.create({
    data: {
      userId: user.id,
      eventType: "NEW_DEVICE",
      ipAddress,
      device,
      metadata: {
        browser,
        os,
      },
    },
  });
}

await prisma.loginAttempt.create({
  data: {
    email: user.email,
    ipAddress,
    successful: true,
    userId: user.id,
  },
});

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
  };
}


async refresh(refreshToken: string) {
  // Verify refresh token
  const payload = verifyRefreshToken(refreshToken);

  // Get all active sessions for this user
  // const sessions = await prisma.session.findMany({
  //   where: {
  //     userId: payload.userId,
  //     isRevoked: false,
  //   },
  // });

  // let matchedSession = null;

  // // Find the session that owns this refresh token
  // for (const session of sessions) {
  //   const matches = await comparePassword(
  //     refreshToken,
  //     session.refreshTokenHash
  //   );

  //   if (matches) {
  //     matchedSession = session;
  //     break;
  //   }
  // }

  // if (!matchedSession) {
  //   throw new Error("Invalid refresh token");
  // }

  const matchedSession = await findSessionByRefreshToken(
  payload.userId,
  refreshToken
);

if (!matchedSession) {
  throw new Error("Invalid refresh token");
}

  // Generate new tokens
  const newAccessToken = generateAccessToken({
    userId: payload.userId,
  });

  const newRefreshToken = generateRefreshToken({
    userId: payload.userId,
  });

  // Rotate refresh token
  const newRefreshTokenHash = await hashPassword(newRefreshToken);

  await prisma.session.update({
    where: {
      id: matchedSession.id,
    },
    data: {
      refreshTokenHash: newRefreshTokenHash,
      lastUsedAt: new Date(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

async logout(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  const session = await findSessionByRefreshToken(
    payload.userId,
    refreshToken
  );

  if (!session) {
    throw new Error("Invalid refresh token");
  }

  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      isRevoked: true,
    },
  });
await prisma.securityEvent.create({
  data: {
    userId: payload.userId,
    eventType: "SESSION_REVOKED",
  },
});

}

async logoutAll(userId: string) {
  await prisma.session.updateMany({
    where: {
      userId,
      isRevoked: false,
    },
    data: {
      isRevoked: true,
    },
  });
}

async getSessions(userId: string) {
  return prisma.session.findMany({
    where: {
      userId,
      isRevoked: false,
    },
    select: {
      id: true,
      device: true,
      browser: true,
      os: true,
      country: true,
      lastUsedAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async revokeSession(userId: string, sessionId: string) {
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (!session) {
    throw new Error("Session not found");
  }

  await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      isRevoked: true,
    },
  });

  await prisma.securityEvent.create({
    data: {
      userId,
      eventType: "SESSION_REVOKED",
    },
  });
}

}



export default new AuthService();