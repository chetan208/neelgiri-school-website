import React from 'react';

export default function ClosedView() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#093C5D]/15 p-6 shadow-sm text-center">
        <div className="w-14 h-14 bg-[#FFC94D] border border-[#06283D]/25 text-[#093C5D] rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0-6v2m0-3.5A3.5 3.5 0 1115.5 8H16a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V10a2 2 0 012-2h.5A3.5 3.5 0 0112 4.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#093C5D] tracking-tight">Admissions Closed</h2>
        <p className="mt-2 text-[#06283D]/70 text-xs leading-relaxed">
          The admission portal for the current academic session is now locked. Registrations will open in the next scheduled cycle.
        </p>
        <div className="mt-4 pt-4 border-t border-[#093C5D]/20 text-[11px] text-[#06283D]/60">
          For physical assistance, contact the administrative desk.
        </div>
      </div>
    </div>
  );
}