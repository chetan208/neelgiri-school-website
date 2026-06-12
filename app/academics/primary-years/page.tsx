import React from "react";
import HeroSection from "@/components/sections/academics/primary/HeroSection";
import CoreModules from "@/components/sections/academics/primary/CoreModules";
import PrimaryCTASection from "@/components/sections/academics/primary/CTASection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Primary School Curriculum | Neelgiri Public School",
  description: "Discover the primary education program (Classes I to VIII) at Neelgiri School, emphasizing holistic growth, core subjects, and creative arts.",
};

export default function PrimaryYearsPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <main>
        <HeroSection />
        <CoreModules />
        <PrimaryCTASection />
      </main>
    </div>
  );
}