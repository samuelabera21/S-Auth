"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/Spinner";

function HomeContent() {
  const { isAuthenticated, loading, fetchUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        await fetchUser();
        router.replace("/dashboard");
        return;
      }

      if (!loading) {
        if (isAuthenticated) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      }
    };

    init();
  }, [isAuthenticated, loading, router, accessToken, fetchUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <Spinner size={32} />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
          <Spinner size={32} />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
