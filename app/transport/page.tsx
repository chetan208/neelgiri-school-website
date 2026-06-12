import React from "react";
import TransportSection from "@/components/sections/transport/TransportSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "School Transportation | Neelgiri Public School",
  description: "Learn about the bus routes, transport rules, safety guidelines, and GPS tracking features of the Neelgiri School transit service.",
};

export default function TransportPageRoute() {
  return <TransportSection />;
}