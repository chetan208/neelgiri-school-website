'use client';

import React from "react";
import HeroSection from "@/components/sections/academics/high/HeroSection";
import AcademicModules from "@/components/sections/academics/high/AcademicModules";
import StudentSpotlight from "@/components/sections/academics/high/StudentSpotlight";
import CTASection from "@/components/sections/academics/high/CTASection";

export default function HighSchoolPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <HeroSection />
      <AcademicModules />
      <StudentSpotlight />
      <CTASection />
    </main>
  );
}