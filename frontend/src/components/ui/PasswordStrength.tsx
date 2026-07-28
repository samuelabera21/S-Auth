"use client";

import React from "react";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const checks = [
    { label: "At least 8 characters", test: password.length >= 8 },
    { label: "Uppercase letter", test: /[A-Z]/.test(password) },
    { label: "Lowercase letter", test: /[a-z]/.test(password) },
    { label: "Number", test: /[0-9]/.test(password) },
    { label: "Special character", test: /[^A-Za-z0-9]/.test(password) },
  ];

  const strength = checks.filter((c) => c.test).length;

  const getStrengthColor = () => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-orange-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength <= 4) return "bg-green-500";
    return "bg-green-600";
  };

  const getStrengthLabel = () => {
    if (strength <= 1) return "Weak";
    if (strength <= 2) return "Fair";
    if (strength <= 3) return "Good";
    if (strength <= 4) return "Strong";
    return "Very Strong";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600 w-16 text-right">
          {getStrengthLabel()}
        </span>
      </div>
      <div className="space-y-1">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`h-1.5 w-1.5 rounded-full ${check.test ? "bg-green-600" : "bg-gray-300"}`}
            />
            <span
              className={`text-xs ${check.test ? "text-green-700" : "text-gray-500"}`}
            >
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
