import React from "react";
import AdmissionSection from "@/components/sections/admission/AdmissionSection";

// CRITICAL: Next.js App Router ko 'export default' component chahiye hota hai
export default function AdmissionsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdmissionSection />
    </div>
  );
}