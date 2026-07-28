import React from "react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      <span className="text-lg font-semibold text-gray-900">Auth</span>
    </div>
  );
}
