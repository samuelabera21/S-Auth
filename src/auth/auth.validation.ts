import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100),

  email: z.email().trim().toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email().trim().toLowerCase(),

    password: z.string().min(1, "Password is required"),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;