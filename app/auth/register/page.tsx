import React from "react";
import RegisterTeacherForm from "@/components/sections/auth/RegisterTeacherForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="animate-in fade-in zoom-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#093C5D]">Create Teacher Account</h1>
      </div>

      <RegisterTeacherForm />

      <div className="mt-6 text-center">
        <p className="text-xs text-[#06283D]">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#FFC94D] font-bold hover:underline bg-transparent border-0 cursor-pointer">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
