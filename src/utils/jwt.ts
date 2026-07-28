import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env.js";

export type JwtPayload = {
  userId: string;
};

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES as StringValue,
  });
};

export const generateEmailVerificationToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(payload, env.JWT_VERIFY_EMAIL_SECRET, {
    expiresIn: env.VERIFY_EMAIL_EXPIRES as StringValue,
  });
};

export const generatePasswordResetToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(payload, env.JWT_RESET_PASSWORD_SECRET, {
    expiresIn: env.RESET_PASSWORD_EXPIRES as StringValue,
  });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES as StringValue,
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};