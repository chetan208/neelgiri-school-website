import React from "react";
import { Shield, Lock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Neelgiri Sr. Sec. Public School",
  description: "Official Privacy Policy of Neelgiri Sr. Sec. Public School, Hatwas. Read about our guidelines on data protection and informational usage.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#093C5D]/15 p-6 sm:p-10 md:p-12 shadow-sm">
        
        {/* Document Header */}
        <div className="border-b border-[#093C5D]/10 pb-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#093C5D]/5 flex items-center justify-center text-[#093C5D]">
              <Shield size={20} />
            </div>
            <span className="text-[10px] font-black text-[#FA6781] tracking-widest uppercase bg-[#FA6781]/10 px-3 py-1 rounded-full">
              Legal Documentation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#093C5D] font-serif leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#06283D]/60 mt-2">
            Effective Date: June 12, 2026 | Neelgiri Sr. Sec. Public School, Hatwas
          </p>
        </div>

        {/* Content Section */}
        <div className="text-[#06283D]/80 text-sm leading-relaxed space-y-8 font-sans">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              1. Introduction
            </h2>
            <p>
              Welcome to the official website of <strong>Neelgiri Sr. Sec. Public School, Hatwas</strong>. We are committed to protecting the privacy of our students, parents, guardians, faculty, and website visitors. This Privacy Policy outlines the types of information we collect through our online platform, how we use it, and the security measures we have established to protect your personal details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              2. Scope of Information Collection
            </h2>
            <p>
              Our website serves a purely informational purpose to showcase school achievements, academic programs, event updates, and notices. We do not engage in tracking, profiling, or extensive personal data harvesting.
            </p>
            <div className="bg-[#093C5D]/5 border-l-4 border-[#093C5D] p-4 rounded-r-xl space-y-2 mt-2">
              <p className="font-bold text-[#093C5D] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={14} className="text-[#FA6781]" /> Financial Data Protection Disclaimer
              </p>
              <p className="text-xs text-[#06283D]/95">
                This website <strong>DOES NOT</strong> collect, request, process, or store any financial, banking, credit card, debit card, or UPI data. The school does not accept online transaction inputs on this platform.
              </p>
            </div>
            <p className="mt-4">
              We only collect basic communication data voluntarily provided by users via the <strong>"Contact Us"</strong> or <strong>"Admission Enquiry"</strong> forms:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Full Name of the Parent/Guardian and/or Student</li>
              <li>Active Email Address</li>
              <li>Contact Phone Number</li>
              <li>Target Class of Admission (if applicable)</li>
              <li>Any voluntary text query submitted in the message field</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              3. Use of Collected Information
            </h2>
            <p>
              Any communication details provided through our web forms are utilized strictly for administrative and educational purposes. Specifically, we use this information to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Respond to your direct admission enquiries or contact messages.</li>
              <li>Provide relevant updates regarding school admissions, academic schedules, or event calendars.</li>
              <li>Facilitate initial communication during the enrollment process.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              4. Data Sharing and Non-Disclosure
            </h2>
            <p>
              We enforce a strict anti-spam policy. <strong>Neelgiri Sr. Sec. Public School, Hatwas</strong> guarantees that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>We will <strong>never</strong> sell, rent, lease, trade, or share your contact details or personal information with third-party marketing or advertising agencies.</li>
              <li>Access to your submitted enquiry data is strictly restricted to authorized administrative personnel of the school who require it to address your request.</li>
              <li>We will only disclose your information if legally required to do so by government education authorities or judicial orders.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              5. Data Security
            </h2>
            <p>
              We employ industry-standard technical and organizational security measures (including SSL encryption across our web server) to protect your communication details from unauthorized access, alteration, disclosure, or destruction. However, please note that no method of transmission over the internet or electronic storage is 100% secure, and while we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#093C5D] flex items-center gap-2 font-serif border-b border-[#093C5D]/5 pb-1">
              6. Policy Updates
            </h2>
            <p>
              The school administration reserves the right to update this Privacy Policy at any time to reflect changing regulations or technical enhancements. Any updates will be immediately posted on this page with an updated revision date.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
