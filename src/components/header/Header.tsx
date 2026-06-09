'use client';

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [activeNav, setActiveNav] = useState("Home");

  const ddTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

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
      <header className={`hdr hdr-nav sticky top-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-100/80 shadow-sm" : "bg-transparent"}`}>
        <div className="absolute top-0 left-0 right-0 h-[3px] opacity-90" style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT2}, ${ACCENT})` }} />
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-5 lg:px-7 xl:px-8">
          <div className="flex items-center justify-between h-[76px]">
            <div className="flex items-center shrink-0 transform hover:scale-[1.01] transition-transform duration-200">
              <Logo />
            </div>
            <div className="hidden lg:flex items-center justify-center flex-1 px-8">
              <DesktopNav
                navItems={navItems}
                activeNav={activeNav}
                setActiveNav={setActiveNav}
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