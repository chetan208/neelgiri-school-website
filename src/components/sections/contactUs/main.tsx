'use client'
import { useState, useEffect } from "react";

interface FormData { name: string; email: string; phoneNumber: string; message: string; }
interface FormErrors { name?: string; contact?: string; message?: string; }

export default function ContactUs({ isHomePage = false }: { isHomePage?: boolean }) {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", phoneNumber: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    const hasEmail = formData.email.trim() !== "";
    const hasPhone = formData.phoneNumber.trim() !== "";

    if (!hasEmail && !hasPhone) newErrors.contact = "Provide either email or phone number.";
    else if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.contact = "Invalid email address.";
    else if (hasPhone && !/^\d{7,15}$/.test(formData.phoneNumber.replace(/[\s\-\+]/g, ""))) newErrors.contact = "Invalid phone number.";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name === "email" || e.target.name === "phoneNumber" ? "contact" : e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || ""}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message.");
      
      const data = await response.json();
      if (data) setSubmitted(true);
    } catch (err) {
      setApiError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <section className={`w-full ${isHomePage ? 'py-16 sm:py-24 border-t border-[#093C5D]/10' : 'min-h-screen py-12'} bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden`}>
      
      {/* Centered Animated Box */}
      <div className={`w-full max-w-4xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-10 md:p-12 transform transition-all duration-700 ease-out border border-[#093C5D]/15 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg width="18" height="20" viewBox="0 0 24 28" fill="none" className="text-[#FFC94D] animate-pulse">
              <path d="M12 0L0 5.33333V13.3333C0 20.72 5.14667 27.5867 12 29.3333C18.8533 27.5867 24 20.72 24 13.3333V5.33333L12 0Z" fill="currentColor"/>
            </svg>
            <span className="text-[11px] font-black text-[#FFC94D] tracking-widest uppercase">Neelgiri Public School</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#093C5D] mb-3 font-serif">Get in Touch</h1>
          <p className="text-xs sm:text-sm text-[#06283D]/70 max-w-md mx-auto leading-relaxed">Have questions about admissions, curriculum, or facilities? Fill out the form below and we will contact you shortly.</p>
        </div>

        {submitted ? (
          /* Success Animation */
          <div className="py-12 text-center flex flex-col items-center gap-5 animate-[fadeIn_0.5s_ease-out]">
            <div className="w-16 h-16 bg-[#59B292]/15 rounded-full flex items-center justify-center mb-2 shadow-inner">
              <svg className="w-8 h-8 text-[#59B292]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-[#093C5D]">Message Sent Successfully!</h2>
            <p className="text-xs text-[#06283D]/70 max-w-sm">Thank you for reaching out. A school representative will contact you on your provided details soon.</p>
            <button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phoneNumber: "", message: "" }); }} className="mt-4 px-6 py-2.5 bg-[#093C5D] text-white rounded-xl hover:bg-[#FA6781] font-bold text-xs transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border-0 shadow-sm">Send Another Message</button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            
            <div className="flex flex-col gap-5">
              <div className="group">
                <label className="text-xs font-bold text-[#093C5D] block mb-1.5 transition-colors group-focus-within:text-[#FFC94D]">Full Name <span className="text-red-500">*</span></label>
                <input name="name" type="text" placeholder="e.g. Chetan Sharma" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 text-xs rounded-xl border text-[#093C5D] placeholder:text-[#06283D]/40 transition-all duration-300 hover:border-[#093C5D]/40 focus:border-[#093C5D] ${errors.name ? 'border-red-300 bg-red-50' : 'border-[#093C5D]/15 bg-[#F8FAFC]'} focus:ring-2 focus:ring-[#093C5D]/10 focus:bg-white outline-none`} />
                {errors.name && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.name}</p>}
              </div>
              
              <div className="group">
                <label className="text-xs font-bold text-[#093C5D] flex items-center gap-2 mb-1.5 transition-colors group-focus-within:text-[#FFC94D]">Email Address</label>
                <input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 text-xs rounded-xl border text-[#093C5D] placeholder:text-[#06283D]/40 transition-all duration-300 hover:border-[#093C5D]/40 focus:border-[#093C5D] ${errors.contact ? 'border-red-300 bg-red-50' : 'border-[#093C5D]/15 bg-[#F8FAFC]'} focus:ring-2 focus:ring-[#093C5D]/10 focus:bg-white outline-none`} />
              </div>
              
              <div className="flex items-center gap-3 py-1">
                <hr className="flex-1 border-[#093C5D]/10"/>
                <span className="text-[10px] text-[#06283D]/40 font-black tracking-widest">OR</span>
                <hr className="flex-1 border-[#093C5D]/10"/>
              </div>
              
              <div className="group">
                <label className="text-xs font-bold text-[#093C5D] flex items-center gap-2 mb-1.5 transition-colors group-focus-within:text-[#FFC94D]">Phone Number</label>
                <input name="phoneNumber" type="tel" placeholder="+91 70354 23345" value={formData.phoneNumber} onChange={handleChange} className={`w-full px-4 py-3 text-xs rounded-xl border text-[#093C5D] placeholder:text-[#06283D]/40 transition-all duration-300 hover:border-[#093C5D]/40 focus:border-[#093C5D] ${errors.contact ? 'border-red-300 bg-red-50' : 'border-[#093C5D]/15 bg-[#F8FAFC]'} focus:ring-2 focus:ring-[#093C5D]/10 focus:bg-white outline-none`} />
                {errors.contact && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.contact}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex-1 flex flex-col group">
                <label className="text-xs font-bold text-[#093C5D] block mb-1.5 transition-colors group-focus-within:text-[#FFC94D]">Message <span className="text-red-500">*</span></label>
                <textarea name="message" placeholder="Write your message here..." value={formData.message} onChange={handleChange} className={`w-full flex-1 min-h-[160px] md:min-h-[200px] px-4 py-3 text-xs rounded-xl border text-[#093C5D] placeholder:text-[#06283D]/40 transition-all duration-300 hover:border-[#093C5D]/40 focus:border-[#093C5D] ${errors.message ? 'border-red-300 bg-red-50' : 'border-[#093C5D]/15 bg-[#F8FAFC]'} focus:ring-2 focus:ring-[#093C5D]/10 focus:bg-white outline-none resize-none`} />
                {errors.message && <p className="text-[11px] text-red-500 mt-1 ml-1">{errors.message}</p>}
              </div>
              
              {apiError && <p className="text-xs text-red-500 text-center bg-red-50 p-2.5 rounded-lg border border-red-100">{apiError}</p>}
              
              <button type="submit" disabled={loading} className="w-full py-3 bg-[#FA6781] text-white hover:bg-[#093C5D] rounded-xl font-bold text-xs tracking-wider border-2 border-[#06283D] shadow-[3px_3px_0px_#06283D] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#06283D] transition-all duration-150 disabled:opacity-75 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0px_#06283D] flex justify-center items-center gap-2 cursor-pointer">
                {loading ? (
                   <><svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending...</>
                ) : "Send Message"}
              </button>
            </div>
            
          </form>
        )}
      </div>
    </section>
  );
}