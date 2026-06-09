import React from "react";
import StreamCard from "./StreamCard";

export default function CommerceStream() {
  return (
    <StreamCard
      title="Commerce Stream"
      image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop"
      description="Commerce develops strong business understanding, financial literacy, entrepreneurial mindset, and leadership abilities for the modern economic world."
      subjects={["Accountancy", "Business Studies", "Economics", "Mathematics", "Marketing", "English"]}
      careers={["CA", "Finance", "Business Management", "Entrepreneurship", "Banking"]}
    />
  );
}