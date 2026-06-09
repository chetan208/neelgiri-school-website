'use client';

import React, { useState } from "react";
import { Upload, Image, Trash2 } from "lucide-react";

export default function MediaManager() {
  const [media] = useState([{ id: 1, type: "Photo", name: "Annual_Day_01.jpg" }]);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 font-serif">Gallery &amp; Media Manager</h2>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border-0 cursor-pointer">
          <Upload size={14} /> Add Media
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-slate-50 text-slate-500 p-2 rounded-lg border border-slate-100 shrink-0"><Image size={16} /></div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[130px]">{item.name}</p>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-black">{item.type}</span>
              </div>
            </div>
            <button className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors shrink-0 bg-transparent border-0 cursor-pointer">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}