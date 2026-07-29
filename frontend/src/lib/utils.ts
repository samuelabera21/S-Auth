import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiErrorMessage(error: unknown): string {
  const apiError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return (
    apiError.response?.data?.message ||
    apiError.message ||
    "An unexpected error occurred"
  );
}
