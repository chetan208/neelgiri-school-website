import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Central Command Center | Admin Panel",
  description: "Secure database grid to manage statistics matrices, live official notice broadsheets, and paper records.",
};

export default function AdminControlLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}