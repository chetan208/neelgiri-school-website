'use client';

import React, { useState } from "react";
import AcademicsHero from "./AcademicsHero";
import StreamsNav from "./StreamsNav";
import ScienceStream from "./ScienceStream";
import CommerceStream from "./CommerceStream";
import ArtsStream from "./ArtsStream";
import CTASection from "./CTASection";

export default function SeniorSecondaryContent() {
  const [active, setActive] = useState("science");

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
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
