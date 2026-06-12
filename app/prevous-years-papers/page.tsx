import React from "react";
import PYQArchiveContent from "@/components/sections/pyqs/PYQArchiveContent";
import { Metadata } from "next";

export interface PaperType {
  id: string | number;
  subject: string;
  year: string;
  term: string;
  fileUrl: string;
}

export const metadata: Metadata = {
  title: "Previous Years Question Papers | Neelgiri Public School",
  description: "Access our database of verified previous years question papers (PYQs) for classes 11 and 12. Boost your board exam prep.",
};

export default function PYQArchiveRoute() {
  return <PYQArchiveContent />;
}