import React from "react";
import StreamCard from "./StreamCard";

export default function ArtsStream() {
  return (
    <StreamCard
      title="Arts &amp; Humanities"
      image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
      description="Arts encourages creativity, communication, critical thinking, and cultural understanding while preparing students for diverse and impactful careers."
      subjects={["History", "Political Science", "Psychology", "Sociology", "Literature", "English"]}
      careers={["Law", "Journalism", "Design", "Civil Services", "Psychology"]}
    />
  );
}