import React from "react";
import StreamCard from "./StreamCard";

export default function NonMedicalStream() {
  return (
    <StreamCard
      title="Non-Medical Stream"
      image="/assets/academics/senior/chemistry_lab.jpg"
      description="The Non-Medical stream focuses on mathematics, physics, and chemistry, developing strong analytical, logical, and computational skills. This stream is ideal for students aiming for careers in engineering, architecture, computer science, aviation, and physical sciences."
      subjects={["Mathematics", "Physics", "Chemistry", "English", "Computer Science / Physical Education"]}
      careers={["Engineering (B.Tech)", "Architecture", "Aviation & Pilot", "Computer Science & IT", "Physics & Mathematics Research"]}
    />
  );
}
