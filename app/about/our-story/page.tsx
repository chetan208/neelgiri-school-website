'use client';

import React from "react";
import HistoryTimeline from "@/components/sections/homeSections/profile/HistoryTimeline";

export default function OurStoryPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-4">
      {/* Direct HistoryTimeline component ko render kiya */}
      <HistoryTimeline />
    </div>
  );
}