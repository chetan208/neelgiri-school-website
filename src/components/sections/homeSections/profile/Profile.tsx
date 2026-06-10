import React from "react";
import MissionVision from "./MissionVision";
import PrincipalWelcome from "./PrincipalWelcome";
import HistoryTimeline from "./HistoryTimeline";


export default function SchoolProfile() {
  return (
    <div className="bg-slate-50 text-brand-text-dark min-h-screen border-y border-slate-200/60">
      <MissionVision />
      <PrincipalWelcome />
      <HistoryTimeline />
 
    </div>
  );
}
