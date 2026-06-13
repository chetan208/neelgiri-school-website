'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { admissionService, AdmissionFormData } from './admissionService';
import LoadingView from './LoadingView';
import ClosedView from './ClosedView';
import SuccessView from './SuccessView';

const classes = ["Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const sideImages = [
  "/assets/academics/high/admission_banner.jpg",
  "/assets/academics/primary/primary_students_bridge.jpg"
];

export default function AdmissionSection() {

  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState<AdmissionFormData>({
    studentName: "",
    FatherName: "",
    MotherName: "",
    dob: "",
    targetClass: "",
    address: "",
    phoneNumber: "",
    email: ""
  });

  useEffect(() => {
    async function checkTimeline() {
      try {
        const data = await admissionService.getActiveYear();
        setActiveYear(data.year);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    checkTimeline();

    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % sideImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await admissionService.submitForm(formData);
      setIsSubmitted(true);
    } catch (err) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError(String(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmitError("");
    setFormData({
      studentName: "",
      FatherName: "",
      MotherName: "",
      dob: "",
      targetClass: "",
      address: "",
      phoneNumber: "",
      email: ""
    });
  };

  if (loading) return <LoadingView />;
  if (!activeYear) return <ClosedView />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#093C5D] py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-sm border border-[#093C5D]/15 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        
        {/* Sidebar Banner */}
        <div className="lg:col-span-4 bg-[#093C5D] p-5 text-white flex flex-col justify-between relative overflow-hidden min-h-[180px] lg:min-h-full">
          <div className="absolute inset-0 z-0 opacity-15">
            {sideImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={idx === 0 ? "Neelgiri Public School student admission activities" : "Neelgiri primary school students standing together on a campus bridge"}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentImg ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>

          <div className="relative z-10 space-y-1.5">
            <span className="bg-[#FFC94D]/30 text-[#FFC94D] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-[#FFC94D]/20">
              Session {activeYear}
            </span>
            <h2 className="text-xl font-bold leading-tight">Shape Your Child&apos;s Future</h2>
            <p className="text-white/80 text-[11px] leading-relaxed">
              Neelgiri Public Senior Secondary School provides an interactive pipeline to secure structural student configurations.
            </p>
          </div>

          <div className="relative z-10 pt-3 border-t border-white/20 flex items-center space-x-2 text-[10px] text-white/85">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC94D] animate-ping" />
            <span>Applications are actively evaluated.</span>
          </div>
        </div>

        {/* Form Content Block */}
        <div className="lg:col-span-8 p-5 sm:p-7 flex flex-col justify-center relative">
          {!isSubmitted ? (
            <div className="w-full">
              <div className="mb-4">
                <h1 className="text-lg font-bold text-[#093C5D]">Online Registration Form</h1>
                <p className="text-xs text-[#06283D]/70">Provide authentic student specifications to reserve academic slots.</p>
              </div>

              {submitError && (
                <div className="mb-4 p-2.5 bg-rose-50 border-l-4 border-rose-600 text-rose-900 rounded-r-lg text-xs font-medium">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Student Name</label>
                    <input 
                      type="text" 
                      name="studentName"
                      required
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition-all text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 font-sans">Father&apos;s Name</label>
                    <input 
                      type="text" 
                      name="FatherName"
                      required
                      value={formData.FatherName}
                      onChange={handleChange}
                      placeholder="Father's name"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition-all text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 font-sans">Mother&apos;s Name</label>
                    <input 
                      type="text" 
                      name="MotherName"
                      required
                      value={formData.MotherName}
                      onChange={handleChange}
                      placeholder="Mother's name"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition-all text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Date of Birth</label>
                    <input 
                      type="date" 
                      name="dob"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition-all text-xs text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Class to be Admitted</label>
                    <select 
                      name="targetClass"
                      required
                      value={formData.targetClass}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition-all text-xs cursor-pointer"
                    >
                      <option value="">Select Class</option>
                      {classes.map((cls, idx) => (
                        <option key={idx} value={cls}>{cls} Standard</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="10-digit mobile"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition-all text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="parent@example.com"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition-all text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Residential Address</label>
                  <textarea 
                    name="address"
                    required
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Complete residential address..."
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093C5D] focus:bg-white transition-all text-xs resize-none"
                  />
                </div>

                <div className="flex items-start gap-2 py-1 select-none">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    required
                    className="mt-0.5 w-3.5 h-3.5 accent-[#093C5D] border border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="acceptTerms" className="text-[10px] text-slate-500 font-medium leading-snug cursor-pointer">
                    I agree to the <Link href="/terms-conditions" target="_blank" className="text-[#093C5D] font-bold underline hover:text-[#FA6781]">Terms &amp; Conditions</Link> and <Link href="/school-policies" target="_blank" className="text-[#093C5D] font-bold underline hover:text-[#FA6781]">School Policies</Link> of the institution.
                  </label>
                </div>

                <div className="pt-1.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-2 bg-[#FA6781] hover:bg-[#093C5D] text-white font-medium rounded-lg text-xs transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer border-0"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Processing Request...</span>
                      </>
                    ) : (
                      <span>Submit Registration Request</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <SuccessView 
              studentName={formData.studentName} 
              onReset={handleReset} 
            />
          )}
        </div>

      </div>
    </div>
  );
}