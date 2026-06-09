import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gatekeeper Portal | Neelgiri Public School",
  description: "Secure workspace terminal to access specialized student profiles and teacher configurations.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}