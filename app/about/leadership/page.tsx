import React from "react";
import StaffTeam from "@/components/sections/leadership/StaffTeam";

export const metadata = {
  title: "Leadership Team | Neelgiri Public School",
  description: "Meet our principal and expert team of dedicated educators.",
};

export default function LeadershipPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <StaffTeam />
    </div>
  );
}