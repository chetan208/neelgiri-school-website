import React from "react";
import { Metadata } from "next";

import { GraduationCap } from "lucide-react";
import { AuthProtected } from "@/components/Protected";

export const metadata: Metadata = {
  title: "Gatekeeper Portal | Neelgiri Public School",
  description: "Secure workspace terminal to access specialized student profiles and teacher configurations.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProtected>
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="w-full max-w-[850px] bg-white rounded-3xl shadow-sm border border-[#F8FAFC] flex overflow-hidden min-h-[550px]">
          
          {/* Left Side - Light Academic Theme */}
          <div className="hidden md:flex w-[45%] bg-[#F8FAFC] p-12 flex-col justify-between relative">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FFC94D] flex items-center justify-center">
                <GraduationCap className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#093C5D] leading-tight">Excellence in <br/> Education.</h2>
                <p className="text-[#06283D] mt-4 text-xs leading-relaxed">
                  Neelgiri Public School is committed to fostering a community of lifelong learners, critical thinkers, and responsible global citizens.
                </p>
              </div>
            </div>
            <div className="text-[#06283D] text-[10px] font-medium uppercase tracking-wider opacity-70">
              Ac 2026 Neelgiri Public School.
            </div>
          </div>

          {/* Right Side - Form Wrapper */}
          <div className="w-full md:w-[55%] p-10 lg:p-16 flex flex-col justify-center">
            <div className="max-w-[400px] w-full mx-auto">
              {children}
            </div>
          </div>

        </div>
      </div>
    </AuthProtected>
  );
}