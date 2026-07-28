"use client";

import React from "react";
import { Spinner } from "@/components/ui/Spinner";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={40} />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
