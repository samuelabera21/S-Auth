export interface User {
  id: string;
  fullName: string;
  email: string;
  emailVerified?: boolean;
  createdAt?: string;
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  country?: string;
  lastUsedAt?: string;
  createdAt: string;
  isCurrent?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  token: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: User;
  accessToken?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export type PasswordStrength = "weak" | "fair" | "good" | "strong";
