'use client';

import React, { useState } from "react";
import AcademicsHero from "./AcademicsHero";
import StreamsNav from "./StreamsNav";
import MedicalStream from "./MedicalStream";
import NonMedicalStream from "./NonMedicalStream";
import CTASection from "./CTASection";

export default function SeniorSecondaryContent() {
  const [active, setActive] = useState("medical");

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <AcademicsHero />

      <div id="streams-section" className="max-w-7xl mx-auto px-5 py-16 scroll-mt-20">
        <StreamsNav
          active={active}
          setActive={setActive}
        />

        <div className="mt-12">
          {active === "medical" && <MedicalStream />}
          {active === "non-medical" && <NonMedicalStream />}
        </div>
      </div>

      <CTASection />
    </div>
  );
}
