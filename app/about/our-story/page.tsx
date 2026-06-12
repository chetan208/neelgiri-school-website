import React from "react";
import HistoryTimeline from "@/components/sections/homeSections/profile/HistoryTimeline";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story & History | Neelgiri Public School",
  description: "Read about the journey, origin, values, and milestone achievements of Neelgiri Public School over the past three decades.",
};

export default function OurStoryPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-4">
      {/* Direct HistoryTimeline component ko render kiya */}
      <HistoryTimeline />
    </div>
  );
}