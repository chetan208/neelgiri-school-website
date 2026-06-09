import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "School Transport Routes & Connectivity | Neelgiri Public School",
  description: "Track official route matrix lists, active pick-up terminal coverage stations and tracking maps.",
};

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}