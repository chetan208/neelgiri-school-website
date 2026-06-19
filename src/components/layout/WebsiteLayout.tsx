'use client';

import React from "react";
import { usePathname } from "next/navigation";
import SchoolHeader from "../header/Header";
import SchoolFooter from "../Footer";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Show header and footer conditionally depending on route
  const showHeader = !pathname?.startsWith("/erp") && !pathname?.startsWith("/receipt");
  const showFooter = !pathname?.startsWith("/erp") && !pathname?.startsWith("/auth") && !pathname?.startsWith("/admin") && !pathname?.startsWith("/receipt");

  return (
    <>
      {showHeader && <SchoolHeader />}
      <main>{children}</main>
      {showFooter && <SchoolFooter />}
    </>
  );
}
