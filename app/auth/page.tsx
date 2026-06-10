'use client';

import React, { useState } from "react";
import { GraduationCap } from "lucide-react";
import { AuthProtected } from "@/components/Protected";
import LoginForm from "@/components/sections/auth/LoginForm";
import ForgotPasswordForm from "@/components/sections/auth/ForgotPasswordForm";
import RegisterStudentForm from "@/components/sections/auth/RegisterStudentForm";
import RegisterTeacherForm from "@/components/sections/auth/RegisterTeacherForm";

export default function AuthPage() {
  const [view, setView] = useState<"login" | "forgot" | "register">("login");
  const [role, setRole] = useState<"student" | "teacher">("student");

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
              © 2026 Neelgiri Public School.
            </div>
          </div>

          {/* Right Side - Form Wrapper */}
          <div className="w-full md:w-[55%] p-10 lg:p-16 flex flex-col justify-center">
            <div className="max-w-[400px] w-full mx-auto">
              
              {view === "login" && <LoginForm setView={setView} />}
              {view === "forgot" && <ForgotPasswordForm setView={setView} />}
              
              {view === "register" && (
                <div className="animate-in fade-in zoom-in duration-500">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#093C5D]">Create Account</h2>
                    
                    {/* Role Toggle Switch */}
                    <div className="flex bg-[#F8FAFC] p-1 rounded-xl mt-4">
                      <button 
                        onClick={() => setRole("student")} 
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border-0 cursor-pointer ${role === "student" ? "bg-white shadow-sm text-[#093C5D]" : "text-[#06283D] bg-transparent"}`}
                      >
                        Student
                      </button>
                      <button 
                        onClick={() => setRole("teacher")} 
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border-0 cursor-pointer ${role === "teacher" ? "bg-white shadow-sm text-[#093C5D]" : "text-[#06283D] bg-transparent"}`}
                      >
                        Teacher
                      </button>
                    </div>
                  </div>

                  {role === "student" ? (
                    <RegisterStudentForm setView={setView} />
                  ) : (
                    <RegisterTeacherForm setView={setView} />
                  )}

                  <div className="mt-6 text-center">
                    <p className="text-xs text-[#06283D]">
                      Already have an account?{" "}
                      <button onClick={() => setView("login")} className="text-[#FFC94D] font-bold hover:underline bg-transparent border-0 cursor-pointer">
                        Sign In here
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </AuthProtected>
  );
}