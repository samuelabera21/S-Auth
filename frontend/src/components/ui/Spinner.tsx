import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.SVGAttributes<SVGElement> {
  size?: number;
}

export function Spinner({ className, size = 24, ...props }: SpinnerProps) {
  return (
    <svg
      className={cn("animate-spin text-gray-500", className)}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
