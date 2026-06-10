'use client';

import React from 'react';

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export default function ApplicationDetailsModal({ isOpen, onClose, data }: ApplicationDetailsModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06283D]/50 backdrop-blur-xs p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Banner Title */}
        <div className="bg-[#093C5D] px-6 py-4 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold">{data.studentName}</h2>
            <p className="text-white/80 text-xs mt-0.5">Application ID: {data.id}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#06283D] border-0 bg-transparent cursor-pointer rounded-full transition-colors text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Modal Data Matrix Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Class</h4>
              <p className="text-xs font-semibold text-[#FA6781]">{data.targetClass}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Birth</h4>
              <p className="text-xs font-medium text-slate-800">{new Date(data.dob).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parents Details</h4>
              <p className="text-xs font-medium text-slate-800"><span className="text-slate-500">Father:</span> {data.FatherName}</p>
              <p className="text-xs font-medium text-slate-800"><span className="text-slate-500">Mother:</span> {data.MotherName}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Info</h4>
              <p className="text-xs font-medium text-slate-800">📞 {data.phoneNumber}</p>
              <p className="text-xs font-medium text-slate-800">✉️ {data.email || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Residential Address</h4>
              <p className="text-xs font-medium text-slate-800 bg-[#F8FAFC] p-2 rounded-lg border border-[#093C5D]/10">{data.address}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Application Date</h4>
              <p className="text-xs font-medium text-slate-800">{new Date(data.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <span className={`px-3 py-1 text-[10px] font-black tracking-wider rounded-full ${data.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : data.status === 'APPROVED' ? 'bg-[#59B292]/15 text-[#59B292]' : 'bg-rose-100 text-rose-700'}`}>
            Status: {data.status}
          </span>
          <button onClick={onClose} className="px-4 py-2 border-0 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer">Close Panel</button>
        </div>
      </div>
    </div>
  );
}