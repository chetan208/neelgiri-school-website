import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Previous Years Question Papers | Neelgiri Public School",
  description: "Access our comprehensive academic archive of past board and term question papers across multiple classes and subjects.",
};

export default function PYQArchiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}