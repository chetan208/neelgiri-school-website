import React from "react";
import StreamCard from "./StreamCard";

export default function MedicalStream() {
  return (
    <StreamCard
      title="Medical Stream"
      image="/assets/academics/senior/biology_lab.png"
      description="The Medical stream prepares students with a deep understanding of biological sciences, chemistry, and physics, laying the groundwork for careers in medicine, dentistry, pharmacy, biotechnology, and healthcare research."
      subjects={["Biology", "Chemistry", "Physics", "English", "Physical Education / Computer Science"]}
      careers={["Medicine (MBBS/BDS)", "Biotechnology", "Pharmacy", "Physiotherapy", "Microbiology & Research"]}
    />
  );
}
