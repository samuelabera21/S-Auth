import { prisma } from "../lib/prisma.js";
import { comparePassword } from "../utils/hash.js";

export const findSessionByRefreshToken = async (
  userId: string,
  refreshToken: string
) => {
  const sessions = await prisma.session.findMany({
    where: {
      userId,
      isRevoked: false,
    },
  });

  for (const session of sessions) {
    const matches = await comparePassword(
      refreshToken,
      session.refreshTokenHash
    );

    if (matches) {
      return session;
    }
  }

  return null;
};