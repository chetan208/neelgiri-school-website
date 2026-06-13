import React from "react";
import { FileText, Scale } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Neelgiri Sr. Sec. Public School",
  description: "Official Terms and Conditions governing the use of Neelgiri Sr. Sec. Public School website.",
};

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#093C5D]/15 p-6 sm:p-10 md:p-12 shadow-sm">
        
        {/* Document Header */}
        <div className="border-b border-[#093C5D]/10 pb-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#093C5D]/5 flex items-center justify-center text-[#093C5D]">
              <Scale size={20} />
            </div>
            <span className="text-[10px] font-black text-[#FA6781] tracking-widest uppercase bg-[#FA6781]/10 px-3 py-1 rounded-full">
              Legal Documentation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#093C5D] font-serif leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#06283D]/60 mt-2">
            Last Updated: June 12, 2026 | Neelgiri Sr. Sec. Public School, Hatwas
          </p>
        </div>

        {/* Content Section */}
        <div className="text-[#06283D]/80 text-sm leading-relaxed space-y-8 font-sans">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or using the website of <strong>Neelgiri Sr. Sec. Public School, Hatwas</strong>, you acknowledge that you have read, understood, and agreed to be bound by these Terms &amp; Conditions, as well as all applicable local laws and regulations governing educational websites. If you do not agree, please exit the site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              2. Intellectual Property Rights
            </h2>
            <p>
              All content displayed on this website is the sole and exclusive intellectual property of the school administration.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>Ownership:</strong> All website content—including but not limited to logos, branding, text copy, graphic designs, layout templates, photos, videos, and academic documentation—is protected by copyright, trademark, and intellectual property laws.
              </li>
              <li>
                <strong>Restricted Use:</strong> No part of this website may be copied, reproduced, republished, uploaded, posted, transmitted, or distributed in any form for commercial or public use without prior, explicit written consent from the Principal of Neelgiri Sr. Sec. Public School, Hatwas.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              3. Payment Disclaimer and Offline Transaction Policy
            </h2>
            <p>
              To protect the financial credentials of parents and guardians, this website enforces a strict offline transactional structure.
            </p>
            <div className="bg-[#FA6781]/5 border-l-4 border-[#FA6781] p-4 rounded-r-xl space-y-2 mt-2">
              <p className="font-bold text-[#FA6781] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} className="text-[#093C5D]" /> Strict Offline Payment Policy
              </p>
              <p className="text-xs text-[#06283D]/95">
                This website is purely informational and <strong>does not</strong> support online payment gateways, credit card processing, internet banking transfers, or UPI integrations.
              </p>
            </div>
            <p className="mt-4">
              All academic fees, registration charges, transport fees, and exam dues must be completed <strong>offline at the school fee counter</strong>. Acceptable payment methods at the counter are limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Cash</li>
              <li>Local Account Payee Cheques</li>
              <li>Authorized Bank Challans / Demand Drafts</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              4. Limitation of Liability
            </h2>
            <p>
              While we make every effort to ensure the accuracy and timeliness of the information posted on this website, it is provided on an "as-is" basis.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>Administration Rights:</strong> The school administration reserves the absolute right to modify, update, delete, or suspend any information on the website (including fee schedules, holiday notices, examination timetables, admissions availability, and syllabi) at any time and without prior notice.
              </li>
              <li>
                <strong>Disclaimer:</strong> The school shall not be held liable for any typographical errors, temporary site outages, or any decisions made by users based on outdated or incorrect material. Users are encouraged to verify critical schedules directly with the school administration office.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              5. Governing Law
            </h2>
            <p>
              These Terms &amp; Conditions are governed by and construed in accordance with the laws of the State of Himachal Pradesh and the Republic of India. Any legal disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the competent courts in Himachal Pradesh.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
