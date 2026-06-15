import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import WebsiteLayout from "@/components/layout/WebsiteLayout";

export const metadata: Metadata = {
  title: "Neelgiri School",
  description: "Welcome to Neelgiri School Website",
  icons: {
    icon: "/school_logo.png",
    apple: "/school_logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <WebsiteLayout>{children}</WebsiteLayout>
        </AuthProvider>
      </body>
    </html>
  );
}