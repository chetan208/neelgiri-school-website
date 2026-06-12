import React from "react";
import AllNoticesPage from "@/components/sections/notices/AllNoticesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Official Announcements & Notices | Neelgiri Public School",
  description: "Stay informed with the latest notifications, exam schedules, curricular activities, and guidelines from Neelgiri Public School.",
};

export default function NoticesRouteEntry() {
  return <AllNoticesPage />;
}