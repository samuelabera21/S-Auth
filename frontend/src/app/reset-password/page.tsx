"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/PageContainer";
import { Card } from "@/components/ui/Card";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Logo } from "@/components/Logo";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { authService } from "@/services/auth";
import { Spinner } from "@/components/ui/Spinner";
import { getApiErrorMessage } from "@/lib/utils";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError("");
    setLoading(true);
    try {
      const result = await authService.resetPassword(data.token, data.password);
      if (result.success) {
        setSuccessMessage(result.message || "Password reset successfully");
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
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center gap-6">
            <Logo />
            <div className="p-3 rounded-full bg-green-50">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900">Password changed</h1>
              <p className="mt-2 text-sm text-gray-600">{successMessage}</p>
            </div>
            <Link href="/login">
              <Button className="w-full">Return to Login</Button>
            </Link>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <Logo />
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Reset your password</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create a new password for your account
            </p>
          </div>

          {error && (
            <Alert variant="error" title="Error" className="w-full">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <input type="hidden" {...register("token")} />

            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              error={errors.password?.message}
              {...register("password")}
            />

            {password && <PasswordStrength password={password} />}

            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm new password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button type="submit" className="w-full" loading={loading} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </Card>
    </PageContainer>
  );
}

function LoadingFallback() {
  return (
    <PageContainer className="flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <Logo />
          <div className="text-center">
            <div className="flex justify-center">
              <Spinner size={32} />
            </div>
            <p className="mt-4 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
