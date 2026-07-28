"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/PageContainer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Logo } from "@/components/Logo";
import { authService } from "@/services/auth";
import { getApiErrorMessage } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError("");
    setLoading(true);
    try {
      const result = await authService.forgotPassword(data.email);
      if (result.success) {
        setSuccessMessage(result.message || "If an account exists, a reset email has been sent.");
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
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <Logo />
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Forgot password?</h1>
            <p className="mt-2 text-sm text-gray-600">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>

          {error && (
            <Alert variant="error" title="Error" className="w-full">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Button type="submit" className="w-full" loading={loading} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-gray-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </PageContainer>
  );
}
