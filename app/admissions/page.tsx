import React from "react";
import AdmissionSection from "@/components/sections/admission/AdmissionSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "School Admissions | Neelgiri Public School",
  description: "Register for admissions online at Neelgiri Public School. Check class vacancies, criteria, and download admission policies.",
};

// CRITICAL: Next.js App Router ko 'export default' component chahiye hota hai
export default function AdmissionsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdmissionSection />
    </div>
  );
}