'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // 💡 Added usePathname
import TopBar from "./TopBar";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import RightActionButtons from "./RightActionButtons";
import MobileDrawer from "./MobileDrawer";
import { navItems, ACCENT, ACCENT2 } from "./navData";
import CSS from "./headerStyles";

export default function SchoolHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDD, setActiveDD] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // 💡 Hook current URL route properties monitor karne ke liye
  const pathname = usePathname();
  const router = useRouter();
  const ddTimer = useRef<NodeJS.Timeout | null>(null);

  // ─── 💡 Dynamic Route Tracking State Management ───
  const activeNav = useMemo(() => {
    // Exact match target logic checking default route hierarchy bounds
    for (const item of navItems) {
      // Condition 1: Single level target elements comparison
      if (item.to && item.to === pathname) {
        return item.label;
      }
      // Condition 2: Nested dropdown element routes extraction tracing
      if (item.dropdown) {
        const hasMatchedChild = item.dropdown.some((child) => child.to === pathname && child.to !== "#");
        if (hasMatchedChild) {
          return item.label; // Return parent tab label if route matches a sub-item
        }
      }
    }
    return "Home"; // Default fallback structure logic boundaries
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openDD = (label: string) => {
    if (ddTimer.current) clearTimeout(ddTimer.current);
    setActiveDD(label);
  };

  const closeDD = () => {
    ddTimer.current = setTimeout(() => {
      setActiveDD(null);
    }, 120);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <style>{CSS}</style>
      <TopBar />
      <header className={`hdr hdr-nav sticky top-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? "bg-white/80 backdrop-blur-md border-b border-[#093C5D]/15 shadow-sm" : "bg-transparent"}`}>
        <div className="absolute top-0 left-0 right-0 h-[3px] opacity-90" style={{ backgroundColor: ACCENT }} />
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-5 lg:px-7 xl:px-8">
          <div className="flex items-center justify-between h-[76px]">
            <div className="flex items-center shrink-0 transform hover:scale-[1.01] transition-transform duration-200">
              <Logo />
            </div>
            <div className="hidden lg:flex items-center justify-center flex-1 px-8">
              <DesktopNav
                navItems={navItems}
                activeNav={activeNav} // 💡 Now handles auto dynamic parameters binding implicitly
                setActiveNav={() => {}} // Local state override disabled as usePathname rules natively
                navigate={handleNavigate}
                activeDD={activeDD}
                openDD={openDD}
                closeDD={closeDD}
              />
            </div>
            <RightActionButtons setMobileOpen={setMobileOpen} />
          </div>
        </div>
      </header>

      {mobileOpen && (
        <MobileDrawer
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          navItems={navItems}
        />
      )}
    </>
  );
}