import React from "react";
import StreamCard from "./StreamCard";

export default function ScienceStream() {
  return (
    <StreamCard
      title="Science Stream"
      image="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop"
      description="The Science stream empowers students with analytical thinking, problem-solving skills, and strong technical foundations for engineering, medicine, research, and technology-driven careers."
      subjects={["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English"]}
      careers={["Engineering", "Medical", "Data Science", "Research", "AI & Robotics"]}
    />
  );
}