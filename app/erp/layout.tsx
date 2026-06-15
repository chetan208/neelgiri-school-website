import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "../globals.css";

export const metadata: Metadata = {
  title: "School ERP | Neelgiri Public School",
  description: "Internal School Management System — Neelgiri Public School",
  icons: { icon: "/school_logo.png" },
};

export default function ERPLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F0F4F8] min-h-screen antialiased">
      {children}
    </div>
  );
}
