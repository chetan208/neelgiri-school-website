import React from "react";
import HeroSection from "@/components/sections/academics/high/HeroSection";
import AcademicModules from "@/components/sections/academics/high/AcademicModules";
import StudentSpotlight from "@/components/sections/academics/high/StudentSpotlight";
import CTASection from "@/components/sections/academics/high/CTASection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "High School Curriculum | Neelgiri Public School",
  description: "Explore the high school academic curriculum (classes IX and X) at Neelgiri Public School, featuring board prep, advanced modules, and workshops.",
};

export default function HighSchoolPage() {
  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <HeroSection />
      <AcademicModules />
      <StudentSpotlight />
      <CTASection />
    </main>
  );
}