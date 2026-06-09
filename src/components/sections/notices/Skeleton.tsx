import React from 'react';

export default function Skeleton() {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-4 animate-pulse flex items-center gap-4">
      <div className="w-12 h-6 bg-slate-200 rounded shrink-0"></div>
      <div className="flex-1 space-y-2 min-w-0">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
      </div>
    </div>
  );
}