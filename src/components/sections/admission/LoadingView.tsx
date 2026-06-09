import React from 'react';

export default function LoadingView() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      <p className="mt-3 text-slate-500 text-xs font-medium animate-pulse">
        Verifying active academic registration timelines...
      </p>
    </div>
  );
}