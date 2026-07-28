import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
}

const variantConfig: Record<AlertVariant, { icon: React.ElementType; bg: string; text: string; border: string }> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  info: {
    icon: Info,
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
  },
};

export function Alert({ variant = "info", title, className, children, ...props }: AlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border",
        config.bg,
        config.border,
        config.text,
        className
      )}
      role="alert"
      {...props}
    >
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        {title && <p className="font-medium text-sm">{title}</p>}
        {children && <p className="text-sm opacity-90">{children}</p>}
      </div>
    </div>
  );
}
