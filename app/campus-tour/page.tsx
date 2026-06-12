import React from "react";
import DocumentationSection from "@/components/sections/homeSections/documentation/main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual Campus Tour | Neelgiri Public School",
  description: "Take a virtual tour of Neelgiri Public School and explore our classrooms, science labs, library, playground, and campus facilities.",
};

export default function CampusTourPage() {
  return (
    <div className="pt-6 bg-[#F8FAFC] min-h-screen">
      <DocumentationSection />
    </div>
  );
}