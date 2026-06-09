'use client';

import React, { useState } from "react";
import AcademicsHero from "@/components/sections/academics/senior/AcademicsHero";
import StreamsNav from "@/components/sections/academics/senior/StreamsNav";
import ScienceStream from "@/components/sections/academics/senior/ScienceStream";
import CommerceStream from "@/components/sections/academics/senior/CommerceStream";
import ArtsStream from "@/components/sections/academics/senior/ArtsStream";
import CTASection from "@/components/sections/academics/senior/CTASection";

export default function SeniorSecondaryPage() {
  const [active, setActive] = useState("science");

  return (
    <div className="bg-[#f7fafc] min-h-screen">
      <AcademicsHero />

      <div className="max-w-7xl mx-auto px-5 py-16">
        <StreamsNav
          active={active}
          setActive={setActive}
        />

        <div className="mt-12">
          {active === "science" && <ScienceStream />}
          {active === "commerce" && <CommerceStream />}
          {active === "arts" && <ArtsStream />}
        </div>
      </div>

      <CTASection />
    </div>
  );
}