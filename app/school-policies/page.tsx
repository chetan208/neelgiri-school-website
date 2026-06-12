import React from "react";
import { BookOpen, Award } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "School Policies | Neelgiri Sen. Sec. Public School",
  description: "Official policies, admission guidelines, fee structures, and code of conduct rules of Neelgiri Sen. Sec. Public School, Hatwas.",
};

export default function SchoolPoliciesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#093C5D]/15 p-6 sm:p-10 md:p-12 shadow-sm">
        
        {/* Document Header */}
        <div className="border-b border-[#093C5D]/10 pb-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#093C5D]/5 flex items-center justify-center text-[#093C5D]">
              <BookOpen size={20} />
            </div>
            <span className="text-[10px] font-black text-[#FA6781] tracking-widest uppercase bg-[#FA6781]/10 px-3 py-1 rounded-full">
              Legal Documentation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#093C5D] font-serif leading-tight">
            School Policies
          </h1>
          <p className="text-xs sm:text-sm text-[#06283D]/60 mt-2">
            Last Updated: June 12, 2026 | Neelgiri Sen. Sec. Public School, Hatwas
          </p>
        </div>

        {/* Content Section */}
        <div className="text-[#06283D]/80 text-sm leading-relaxed space-y-8 font-sans">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              1. Admission Policy
            </h2>
            <p>
              <strong>Neelgiri Sen. Sec. Public School, Hatwas</strong> follows a transparent, merit-based, and non-discriminatory admission process. We welcome students from all backgrounds who demonstrate a desire to learn and excel.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li>
                <strong>Age Criteria:</strong> The candidate must meet the minimum age criteria established by the HPBOSE and State Education Department for the respective class as of 31st March of the academic year.
              </li>
              <li>
                <strong>Mandatory Documentation:</strong> At the time of registration and admission, parents must submit the following original and self-attested documents:
                <ul className="list-circle pl-5 mt-1 space-y-1 text-xs">
                  <li><strong>Birth Certificate:</strong> Official document issued by the Municipal Corporation or Registrar of Births and Deaths.</li>
                  <li><strong>Transfer Certificate (TC):</strong> Countersigned Transfer Certificate from the previous recognized school (applicable for Class 2 upwards).</li>
                  <li><strong>Aadhar Card:</strong> Copy of the candidate’s Aadhar card (and parent/guardian’s Aadhar card for verification).</li>
                  <li><strong>Report Card:</strong> Academic progress report card from the previous class.</li>
                  <li><strong>Passport Photos:</strong> Recent passport-sized color photographs of the student (4 copies) and parents/guardians (2 copies each).</li>
                </ul>
              </li>
              <li>
                <strong>Entrance Assessment:</strong> Admissions to middle and senior secondary classes are subject to clearing a basic academic assessment in English, Mathematics, and Science to evaluate baseline aptitude.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              2. Fee Policy
            </h2>
            <p>
              To maintain academic infrastructure and operational resources, our fee collection schedules are strictly enforced:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Payment Schedule:</strong> Tuition fees and other applicable charges are payable on a monthly/quarterly basis.</li>
              <li><strong>Due Date:</strong> All monthly fees must be cleared on or before the <strong>10th of the respective month</strong>.</li>
              <li><strong>Late Fee Fine:</strong> Payments received after the 10th of the month will attract a standard late payment fine as decided by the school management.</li>
              <li><strong>Fee Counter Timing:</strong> The school fee counter is open on all working days from <strong>09:00 AM to 01:30 PM</strong>.</li>
              <li><strong>Non-Refundability:</strong> Registration fees, admission fees, and annual development charges are strictly non-refundable under any circumstances once the admission is confirmed.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              3. Code of Conduct
            </h2>
            <p>
              Neelgiri Sen. Sec. Public School prides itself on cultivating a safe, disciplined, and supportive environment. Every student is expected to uphold the core values of respect and diligence.
            </p>
            
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider mt-3">Punctuality and Attendance</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Arrival:</strong> Students must arrive at the school premises at least 10 minutes before the morning assembly bell. Latecomers will not be permitted to enter the class without written permission from the Principal.</li>
              <li><strong>Minimum Attendance:</strong> A minimum of <strong>75% cumulative attendance</strong> is compulsory for every student to be eligible to sit for the mid-term, annual, or board examinations.</li>
            </ul>

            <h3 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider mt-3">School Uniform</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Mandatory Attire:</strong> Students must wear the prescribed school uniform on all school days, during examinations, and for official outdoor school trips.</li>
              <li><strong>Presentation:</strong> The uniform must be clean, well-ironed, and worn with polished shoes. Dyed hair, fancy haircuts, jewelry, makeup, and painted nails are strictly prohibited.</li>
            </ul>

            <div className="bg-rose-50 border-l-4 border-[#FA6781] p-4 rounded-r-xl space-y-2 mt-4">
              <p className="font-bold text-[#FA6781] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Award size={14} className="text-[#FA6781]" /> Zero-Tolerance Disciplines
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                <li><strong>Ragging and Bullying:</strong> Any form of physical, verbal, emotional, or cyber bullying is strictly prohibited and will result in immediate suspension or expulsion.</li>
                <li><strong>Indiscipline:</strong> Vandalism of school property, using abusive language, showing disrespect to teachers or support staff, or bringing prohibited electronic devices (e.g., mobile phones, smartwatches) to campus will meet with severe disciplinary actions.</li>
              </ul>
            </div>

            <p className="mt-3">
              Parents will be held financially responsible for any damage to school property (furniture, lab equipment, library books) caused by negligent or deliberate behavior of their child.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
