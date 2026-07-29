"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { PageContainer } from "@/components/PageContainer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Logo } from "@/components/Logo";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { getApiErrorMessage } from "@/lib/utils";

const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const googleHref = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return `${base}/api/v1/auth/google`;
  }, []);
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    setLoading(true);
    try {
      const result = await registerUser(data.fullName, data.email, data.password);
      if (result.success) {
        setSuccessMessage(result.message || "Account created successfully");
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageContainer className="flex items-center justify-center">
        <Card className="w-full p-8">
          <div className="flex flex-col items-center gap-6">
            <Logo />
            <div className="p-3 rounded-full bg-green-50">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900">Check your email</h1>
              <p className="mt-2 text-sm text-gray-600">{successMessage}</p>
            </div>
            <Link href="/login">
              <Button variant="outline" className="w-full">Return to Login</Button>
            </Link>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex items-center justify-center">
      <Card className="w-full p-8">
        <div className="flex flex-col items-center gap-6">
          <Logo />
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Start your journey with us today
            </p>
          </div>

          {error && (
            <Alert variant="error" title="Error" className="w-full">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.fullName?.message}
              {...register("fullName")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <PasswordInput
              label="Password"
              placeholder="Create a strong password"
              error={errors.password?.message}
              {...register("password")}
            />

            {password && (
              <PasswordStrength password={password} />
            )}

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button type="submit" className="w-full" loading={loading} disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <a
            href={googleHref}
            className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.03 2.53-2.16 3.31v2.77h3.49c2.04-1.88 3.23-4.64 3.23-7.94z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.49-2.77c-.98.66-2.23 1.06-3.79 1.06-2.91 0-5.37-1.96-6.25-4.63H2.18v2.86C3.99 20.53 7.73 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.75 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.57-2.01z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.64 0 3.12.56 4.29 1.68l3.22-3.22C17.45 2.09 15.02 1 12 1 7.73 1 3.99 3.47 2.18 7.07l2.57 2.01c.88-2.67 3.34-4.7 6.25-4.7z"
              />
            </svg>
            Continue with Google
          </a>

          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-gray-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </PageContainer>
  );
}
