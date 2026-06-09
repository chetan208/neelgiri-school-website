'use client';

import React, { useState, useEffect } from 'react';
import { admissionService, AdmissionFormData } from './admissionService';
import LoadingView from './LoadingView';
import ClosedView from './ClosedView';
import SuccessView from './SuccessView';

export default function AdmissionSection() {
  const classes = ["Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
  const sideImages = [
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
  ];

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
    } catch (err: any) {
      setSubmitError(err.message);
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
    <div className="min-h-screen bg-slate-50 text-slate-800 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        
        {/* Sidebar Banner */}
        <div className="lg:col-span-4 bg-gradient-to-br from-teal-900 to-teal-700 p-5 text-white flex flex-col justify-between relative overflow-hidden min-h-[180px] lg:min-h-full">
          <div className="absolute inset-0 z-0 opacity-15">
            {sideImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt="School environment"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentImg ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>

          <div className="relative z-10 space-y-1.5">
            <span className="bg-teal-500/30 text-teal-200 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border border-teal-400/20">
              Session {activeYear}
            </span>
            <h2 className="text-xl font-bold leading-tight">Shape Your Child's Future</h2>
            <p className="text-teal-100/80 text-[11px] leading-relaxed">
              Neelgiri Public Senior Secondary School provides an interactive pipeline to secure structural student configurations.
            </p>
          </div>

          <div className="relative z-10 pt-3 border-t border-teal-500/30 flex items-center space-x-2 text-[10px] text-teal-100">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
            <span>Applications are actively evaluated.</span>
          </div>
        </div>

        {/* Form Content Block */}
        <div className="lg:col-span-8 p-5 sm:p-7 flex flex-col justify-center relative">
          {!isSubmitted ? (
            <div className="w-full">
              <div className="mb-4">
                <h1 className="text-lg font-bold text-slate-900">Online Registration Form</h1>
                <p className="text-xs text-slate-500">Provide authentic student specifications to reserve academic slots.</p>
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
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Father's Name</label>
                    <input 
                      type="text" 
                      name="FatherName"
                      required
                      value={formData.FatherName}
                      onChange={handleChange}
                      placeholder="Father's name"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Mother's Name</label>
                    <input 
                      type="text" 
                      name="MotherName"
                      required
                      value={formData.MotherName}
                      onChange={handleChange}
                      placeholder="Mother's name"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-xs"
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
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-xs text-slate-700"
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
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-xs cursor-pointer"
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
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-xs"
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
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-xs"
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
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-xs resize-none"
                  />
                </div>

                <div className="pt-1.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-xs transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer border-0"
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