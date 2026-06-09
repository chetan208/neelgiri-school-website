import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Official Notices Archive | Neelgiri Public School",
  description: "Stay informed with real-time official board updates, examination schedules, declarations, and circular assets.",
};

export default function AllNoticesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}