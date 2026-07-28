import { env } from "../config/env.js";
import { sendEmail } from "../utils/mail.js";

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const link =
    `${env.APP_URL}/api/v1/auth/verify-email?token=${token}`;

  await sendEmail(
    email,
    "Verify your email",
    `
      <h2>Welcome!</h2>

      <p>Please verify your email by clicking the button below.</p>

      <a href="${link}">
        Verify Email
      </a>

      <p>This link expires in 24 hours.</p>
    `
  );
};

export const sendResetPasswordEmail = async (
  email: string,
  token: string
) => {
  const link =
    `${env.CLIENT_URL}/reset-password?token=${token}`;

  await sendEmail(
    email,
    "Reset your password",
    `
      <h2>Password Reset</h2>

      <p>Click the button below to reset your password.</p>

      <a href="${link}">
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
    `
  );
};