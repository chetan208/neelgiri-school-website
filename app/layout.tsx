import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import SchoolHeader from "@/components/header/Header"; // Import custom header
import SchoolFooter from "@/components/Footer";
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
          <SchoolHeader /> {/* pure website par automatically load ho jayega */}
          <main>{children}</main>
          <SchoolFooter/>
        </AuthProvider>
      </body>
    </html>
  );
}