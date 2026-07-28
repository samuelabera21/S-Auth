import { cleanEnv, str, port, bool } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port(),

  DATABASE_URL: str(),

  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),

  // NEW
  JWT_VERIFY_EMAIL_SECRET: str(),
  JWT_RESET_PASSWORD_SECRET: str(),

  ACCESS_TOKEN_EXPIRES: str(),
  REFRESH_TOKEN_EXPIRES: str(),

  // NEW
  VERIFY_EMAIL_EXPIRES: str(),
  RESET_PASSWORD_EXPIRES: str(),

  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  GOOGLE_CALLBACK_URL: str(),

  CLIENT_URL: str(),

  COOKIE_SECURE: bool(),

  SMTP_HOST: str(),
  SMTP_PORT: port(),
  SMTP_USER: str(),
  SMTP_PASS: str(),

  EMAIL_FROM: str(),

  APP_URL: str(),
});