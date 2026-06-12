import React from 'react';
import { Metadata } from 'next';
import OurCourses from '@/components/sections/homeSections/ourCourses/OurCourses';

export const metadata: Metadata = {
  title: "Academic Programmes | Neelgiri Public School",
  description: "Explore the different academic levels and courses offered at Neelgiri Public School, from Primary to Senior Secondary.",
};

export default function AcademicsPage() {
  return (
    <div className="pt-16 bg-white min-h-screen">
      <div className="bg-slate-50 border-b border-slate-200 py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#093C5D] bg-[#093C5D]/10 px-3 py-1 rounded-full">
            Education Pathway
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#093C5D] font-serif leading-tight">
            Academic Programmes
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            Our curriculum is designed to support the development and interests of students at every step of their schooling, providing a foundation for lifelong learning.
          </p>
        </div>
      </div>
      <OurCourses />
    </div>
  );
}
