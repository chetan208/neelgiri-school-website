'use client';

import React, { useEffect } from "react";
// Dhyan dein: Abhi ke liye placeholders component references diye hain,
// jab aap mujhe in sub-components ka code denge tab sahi path update ho jayega.
import HeroSection from "@/components/sections/academics/primary/HeroSection";
import CoreModules from "@/components/sections/academics/primary/CoreModules";
import PrimaryCTASection from "@/components/sections/academics/primary/CTASection";

export default function PrimaryYearsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <main>
        <HeroSection />
        <CoreModules />
        <PrimaryCTASection />
      </main>
    </div>
  );
}