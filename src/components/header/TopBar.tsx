import React from 'react';
import { Bell, Calendar, Mail, Phone } from 'lucide-react';
import { ACCENT, ACCENT2 } from './navData';

export default function TopBar() {
  return (
    <div className="hdr hdr-topbar w-full hidden md:block z-50" style={{ backgroundColor: ACCENT }}>
      <div className="w-full z-50 max-w-screen-2xl mx-auto px-4 sm:px-5 lg:px-7 xl:px-8 h-9 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-4">
          <a href="#" className="flex items-center gap-1.5 text-white/80 text-[11px]"><Phone size={11} /> +91 12345 67890</a>
          <a href="#" className="flex items-center gap-1.5 text-white/80 text-[11px]"><Mail size={11} /> info@neelgiri.edu</a>
        </div>
        <p className="text-[11px] text-white font-medium">Admissions Open For 2026–27</p>
        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="flex items-center gap-1 text-white/80 text-[11px]"><Calendar size={11} /> Calendar</a>
          <a href="#" className="flex items-center gap-1 text-white/80 text-[11px]"><Bell size={11} /> Notices</a>
        </div>
      </div>
    </div>
  );
}