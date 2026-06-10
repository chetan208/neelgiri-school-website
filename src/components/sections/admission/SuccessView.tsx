import React from 'react';

interface SuccessViewProps {
  studentName: string;
  onReset: () => void;
}

export default function SuccessView({ studentName, onReset }: SuccessViewProps) {
  return (
    <div className="text-center py-4 px-2 flex flex-col items-center animate-fade-in">
      <div className="w-12 h-12 bg-[#59B292] border border-[#06283D]/20 text-white rounded-full flex items-center justify-center mb-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-[#093C5D]">Application Submitted!</h2>
      <p className="mt-1 text-xs text-white bg-[#59B292] px-3 py-0.5 rounded-full border border-[#06283D]/20">
        Seat Temporarily Reserved Successfully
      </p>
      
      <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#093C5D]/15 rounded-xl text-left max-w-md w-full">
        <p className="text-xs text-[#093C5D] font-medium leading-relaxed">
          Your application has been successfully submitted, and a seat has been temporarily reserved for <strong>{studentName}</strong>. You are now required to visit the school campus for the document verification and final admission process.
        </p>
        <div className="mt-3 flex items-center space-x-2 text-[11px] text-[#093C5D] bg-[#FFC94D] p-2.5 rounded-lg border border-[#06283D]/25">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span><strong>Note:</strong> You can visit the school management desk on any official working day.</span>
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-5 text-xs text-[#FA6781] font-black hover:text-[#093C5D] transition-colors underline underline-offset-4 cursor-pointer bg-transparent border-0"
      >
        Register another candidate
      </button>
    </div>
  );
}