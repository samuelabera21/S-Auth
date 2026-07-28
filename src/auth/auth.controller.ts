import { Request, Response, NextFunction } from "express";
import authService from "./auth.service.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import { env } from "../config/env.js";
import passport from "../config/passport.js";

import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/hash.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = registerSchema.parse(req.body);

    const user = await authService.register(body);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = loginSchema.parse(req.body);

    // const result = await authService.login(body);

    const ipAddress = req.ip || "unknown";
    const userAgent = req.headers["user-agent"] || "";

    const result = await authService.login(body, ipAddress, userAgent);
    //here to change
    //     const ipAddress = req.ip || "unknown";

    // const result = await authService.login(body, ipAddress);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false, // change to true in production with HTTPS
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing",
      });
    }

    const result = await authService.refresh(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    await authService.logout(refreshToken);

    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await authService.logoutAll(req.user!.id);

    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Logged out from all sessions",
    });
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessions = await authService.getSessions(req.user!.id);

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

export const revokeSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await authService.revokeSession(
      req.user!.id,
      req.params.sessionId as string,
    );

    res.json({
      success: true,
      message: "Session revoked",
    });
  } catch (error) {
    next(error);
  }
};

export const google = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as any;

    const accessToken = generateAccessToken({
      userId: user.id,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    const refreshTokenHash = await hashPassword(refreshToken);

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${env.CLIENT_URL}?accessToken=${accessToken}`);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.query.token as string;

    await authService.verifyEmail(token);

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = forgotPasswordSchema.parse(req.body);

    await authService.forgotPassword(body.email);

    res.json({
      success: true,
      message:
        "If an account exists, a reset email has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = resetPasswordSchema.parse(req.body);

    await authService.resetPassword(
      body.token,
      body.password
    );

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
