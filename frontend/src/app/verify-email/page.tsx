"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { Logo } from "@/components/Logo";
import { authService } from "@/services/auth";
import { getApiErrorMessage } from "@/lib/utils";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing");
        return;
      }

      try {
        const result = await authService.verifyEmail(token);
        if (result.success) {
          setStatus("success");
          setMessage(result.message);
        } else {
          setStatus("error");
          setMessage(result.message || "Email verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(getApiErrorMessage(error));
      }
    };

    verify();
  }, [token]);

  return (
    <PageContainer className="flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <Logo />

          {status === "loading" && (
            <>
              <div className="p-3 rounded-full bg-blue-50">
                <Spinner size={32} />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-900">Verifying your email</h1>
                <p className="mt-2 text-sm text-gray-600">Please wait while we verify your email address...</p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="p-3 rounded-full bg-green-50">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-900">Email verified</h1>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
              </div>
              <Link href="/login">
                <Button className="w-full">Continue to Login</Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="p-3 rounded-full bg-red-50">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-900">Verification failed</h1>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
              </div>
              <Link href="/login">
                <Button variant="outline" className="w-full">Return to Login</Button>
              </Link>
            </>
          )}
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
