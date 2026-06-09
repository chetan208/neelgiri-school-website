import React from "react";
import MissionVision from "./MissionVision";
import PrincipalWelcome from "./PrincipalWelcome";
import HistoryTimeline from "./HistoryTimeline";


export default function SchoolProfile() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <MissionVision />
      <PrincipalWelcome />
      <HistoryTimeline />
 
    </div>
  );
}