"use client";

import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Mail, Phone, GraduationCap, School } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { ACCENT } from './navData';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

export default function TopBar() {
  const [admissionYear, setAdmissionYear] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmissionStatus() {
      try {
        const res = await axios.get<{ year: string | null }>(`${SERVER_URL}/api/admissions/active-admission-year`);
        setAdmissionYear(res.data.year);
      } catch (err) {
        console.error("Failed to fetch admission year in TopBar", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdmissionStatus();
  }, []);

  return (
    <div className="hdr hdr-topbar w-full hidden md:block z-50" style={{ backgroundColor: ACCENT }}>
      <div className="w-full z-50 max-w-screen-2xl mx-auto px-4 sm:px-5 lg:px-7 xl:px-8 h-9 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-white/80 text-[11px]">
            <Phone size={11} /> +91 98160 73096
          </span>
          <span className="flex items-center gap-1.5 text-white/80 text-[11px]">
            <Mail size={11} /> info@neelgiripublicschool.in
          </span>
        </div>

        <div className="text-[11px] text-white font-medium select-none flex items-center gap-1.5">
          {loading ? (
            <span className="animate-pulse">Loading status…</span>
          ) : admissionYear ? (
            <Link href="/admissions" className="flex items-center gap-1.5 text-white hover:text-[#FFC94D] transition-colors no-underline cursor-pointer">
              <GraduationCap size={13} className="text-[#FFC94D]" />
              <span>Admissions Open For Session {admissionYear}</span>
            </Link>
          ) : (
            <>
              <School size={12} className="text-[#FFC94D]" />
              <span>Welcome to Neelgiri Sr. Sec. Public School</span>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/academic-calendar" className="flex items-center gap-1 text-white/80 hover:text-white text-[11px] transition-colors no-underline">
            <Calendar size={11} /> School Calendar
          </Link>
          <Link href="/all-notices" className="flex items-center gap-1 text-white/80 hover:text-white text-[11px] transition-colors no-underline">
            <Bell size={11} /> Notices
          </Link>
        </div>
      </div>
    </div>
  );
}