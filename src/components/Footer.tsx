'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

import { motion } from "framer-motion";

export default function Footer() {
  const quickLinks = [
    { label: "About School", href: "/about/our-story" },
    { label: "Admissions", href: "/admissions" },
    { label: "Primary Years", href: "/academics/primary-years" },
    { label: "Middle School", href: "/academics/high-school" },
    { label: "Senior Secondary", href: "/academics/secondary-years" },
    { label: "Contact Us", href: "/contact" },
  ];

  const academicsLinks = [
    { label: "Nursery & Kindergarten", href: "/academics/primary-years" },
    { label: "Primary (1–5)", href: "/academics/primary-years" },
    { label: "Middle School (6–8)", href: "/academics/high-school" },
    { label: "Secondary (9–10)", href: "/academics/high-school" },
    { label: "Senior Secondary (11–12)", href: "/academics/secondary-years" },
    { label: "Science & Computer Labs", href: "/campus-tour" },
  ];

  return (
    <footer className="relative bg-[#041622] overflow-hidden border-t border-[#093C5D]/15">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#FA6781]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#FFC94D]/5 rounded-full blur-3xl"></div>

      {/* Main Footer */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* School Info */}
            <div className="lg:col-span-1">
              
              {/* Logo */}
              <div className="flex items-center gap-3.5">
                <img
                  src="/school_logo.png"
                  alt="Neelgiri Public Sen. Sec. School Logo"
                  className="w-12 h-12 rounded-full object-contain shadow-md"
                />
                <div>
                  <p className="text-base font-bold text-white leading-tight">
                    Neelgiri Public School
                  </p>
                  <p className="text-[10px] text-[#FFC94D] font-medium tracking-wide uppercase mt-0.5">
                    Sen. Sec. Lower Hatwas
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="mt-5 text-slate-400 text-sm leading-relaxed">
                Providing quality education from Nursery to Class 12 with a focus on academics, creativity, innovation, and holistic growth.
              </p>

              {/* Socials */}
              <div className="flex items-center gap-3 mt-6">
                {[
                  <FaFacebookF key="fb" size={15} />,
                  <FaInstagram key="ig" size={17} />,
                  <FaXTwitter key="x" size={15} />,
                ].map((icon, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -3 }}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#FFC94D] text-slate-300 hover:text-[#093C5D] border border-white/10 hover:border-[#FFC94D] flex items-center justify-center transition duration-300 cursor-pointer"
                  >
                    {icon}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-lg">
                Quick Links
              </h3>
              <div className="mt-5 space-y-3">
                {quickLinks.map((item) => (
                  <Link key={item.label} href={item.href} className="no-underline block">
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-2 text-slate-400 hover:text-[#FFC94D] text-sm transition duration-300 cursor-pointer"
                    >
                      <ChevronRight size={15} />
                      {item.label}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Academics */}
            <div>
              <h3 className="text-white font-semibold text-lg">
                Academics
              </h3>
              <div className="mt-5 space-y-3">
                {academicsLinks.map((item) => (
                  <Link key={item.label} href={item.href} className="no-underline block">
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-2 text-slate-400 hover:text-[#FFC94D] text-sm transition duration-300 cursor-pointer"
                    >
                      <ChevronRight size={15} />
                      {item.label}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold text-lg">
                Contact Us
              </h3>
              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#FFC94D] flex items-center justify-center flex-shrink-0">
                    <MapPin size={17} />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Neelgiri Public School, Himachal Pradesh, India
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#FFC94D] flex items-center justify-center flex-shrink-0">
                    <Phone size={17} />
                  </div>
                  <p className="text-slate-400 text-sm">
                    +91 98765 43210
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#FFC94D] flex items-center justify-center flex-shrink-0">
                    <Mail size={17} />
                  </div>
                  <p className="text-slate-400 text-sm">
                    info@neelgirischool.edu
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Block */}
          <div className="mt-10 pt-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © 2026 Neelgiri Public School. All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-500">
              <Link href="/privacy-policy" className="no-underline text-slate-500 hover:text-[#FFC94D] transition">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="no-underline text-slate-500 hover:text-[#FFC94D] transition">
                Terms &amp; Conditions
              </Link>
              <Link href="/school-policies" className="no-underline text-slate-500 hover:text-[#FFC94D] transition">
                School Policies
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}