import React from "react";
import SeniorSecondaryContent from "@/components/sections/academics/senior/SeniorSecondaryContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Senior Secondary Curriculum | Neelgiri Public School",
  description: "Explore senior secondary streams for classes XI and XII. We offer specialized courses in Science, Commerce, and Arts with expert guidance.",
};

export default function SeniorSecondaryPage() {
  return <SeniorSecondaryContent />;
}