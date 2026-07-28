import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined";
}

export function Card({ variant = "default", className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white",
        variant === "outlined" ? "border border-gray-200 shadow-none" : "shadow-sm border border-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
