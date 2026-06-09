import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard Terminal | Neelgiri Public School",
  description: "Secure student credential vault and profile parameters workspace hub.",
};

export default function MyProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}