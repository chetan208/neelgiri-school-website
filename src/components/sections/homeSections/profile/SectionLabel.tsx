import React from "react";

export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 mb-3">
      <span className="block w-6 h-0.5 rounded-full bg-violet-500" />
      <span className="text-xs font-semibold tracking-[0.18em] uppercase text-violet-600">
        {children}
      </span>
    </div>
  );
}