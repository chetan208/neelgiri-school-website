'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sparkles, Loader2 } from "lucide-react";
import PrincipalCard, { FacultyType } from "./PrincipalCard";
import TeacherCard from "./TeacherCard";

export default function StaffTeam() {
  const [staff, setStaff] = useState<FacultyType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    axios.get(`${SERVER_URL}/api/teachers`)
      .then((response) => {
        if (response.data && response.data.teachers) {
          setStaff(response.data.teachers);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching staff data with axios:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-500 gap-3">
        <Loader2 className="animate-spin text-cyan-600" size={32} />
        <p className="text-sm font-semibold tracking-wide uppercase">Loading faculty data...</p>
      </div>
    );
  }

  const principal = staff.find((s) => s.isPrincipal === true);
  const teachers = staff.filter((s) => !s.isPrincipal);

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* HEADING */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 text-[11px] font-bold tracking-[2px] uppercase">
            <Sparkles size={13} />
            Our Faculty
          </div>

          <h1 className="mt-5 text-[2rem] sm:text-[3rem] font-black text-slate-800">
            Meet Our
            <span className="text-cyan-600"> Expert Team</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-slate-500 text-sm sm:text-base leading-[1.9]">
            Dedicated educators committed to empowering students.
          </p>
        </div>

        {/* PRINCIPAL CARD */}
        {principal && <PrincipalCard principal={principal} />}

        {/* TEACHERS SECTION */}
        <div className="mt-14 mb-6">
          <h3 className="text-2xl font-black text-slate-800">
            Our Teachers
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Passionate mentors guiding students.
          </p>
        </div>

        {/* TEACHER GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher.email}
              teacher={teacher}
            />
          ))}
        </div>
      </div>
    </section>
  );
}