'use client';

import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

import { motion } from "framer-motion";

export default function Footer() {
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#093C5D] flex items-center justify-center shadow-lg border border-[#093C5D]/25">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    Neelgiri Public School
                  </h2>
                  <p className="text-xs text-[#FFC94D]">
                    Affiliated to HPBOSE
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
                {[
                  "About School",
                  "Admissions",
                  "Primary Years",
                  "Middle School",
                  "Senior Secondary",
                  "Contact Us",
                ].map((link) => (
                  <motion.div
                    key={link}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-slate-400 hover:text-[#FFC94D] text-sm transition duration-300 cursor-pointer"
                  >
                    <ChevronRight size={15} />
                    {link}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Academics */}
            <div>
              <h3 className="text-white font-semibold text-lg">
                Academics
              </h3>
              <div className="mt-5 space-y-3">
                {[
                  "Nursery & Kindergarten",
                  "Primary (1–5)",
                  "Middle School (6–8)",
                  "Secondary (9–10)",
                  "Senior Secondary (11–12)",
                  "Science & Computer Labs",
                ].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-slate-400 hover:text-[#FFC94D] text-sm transition duration-300 cursor-pointer"
                  >
                    <ChevronRight size={15} />
                    {item}
                  </motion.div>
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
              <span className="hover:text-[#FFC94D] transition cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:text-[#FFC94D] transition cursor-pointer">
                Terms &amp; Conditions
              </span>
              <span className="hover:text-[#FFC94D] transition cursor-pointer">
                School Policies
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}