import React from 'react';

interface SuccessViewProps {
  studentName: string;
  onReset: () => void;
}

export default function SuccessView({ studentName, onReset }: SuccessViewProps) {
  return (
    <div className="text-center py-4 px-2 flex flex-col items-center animate-fade-in">
      <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900">Application Submitted!</h2>
      <p className="mt-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-100">
        Seat Temporarily Reserved Successfully
      </p>
      
      <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-left max-w-md w-full">
        <p className="text-xs text-slate-700 font-medium leading-relaxed">
          Your application has been successfully submitted, and a seat has been temporarily reserved for <strong>{studentName}</strong>. You are now required to visit the school campus for the document verification and final admission process.
        </p>
        <div className="mt-3 flex items-center space-x-2 text-[11px] text-teal-700 bg-teal-50/50 p-2 rounded-lg border border-teal-100">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span><strong>Note:</strong> You can visit the school management desk on any official working day.</span>
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-5 text-xs text-teal-600 font-bold hover:text-teal-700 transition-colors underline underline-offset-4 cursor-pointer bg-transparent border-0"
      >
        Register another candidate
      </button>
    </div>
  );
}