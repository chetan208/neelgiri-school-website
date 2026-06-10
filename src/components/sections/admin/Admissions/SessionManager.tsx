'use client';

import React, { useState } from 'react';
import { adminAdmissionService } from './adminAdmissionService';
import ConfirmationModal from './ConfirmationModal';

interface SessionManagerProps {
  activeYear: string | null;
  refreshSession: () => Promise<void>;
}

export default function SessionManager({ activeYear, refreshSession }: SessionManagerProps) {
  const [yearInput, setYearInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', isError: false });

  const handleAction = async (action: 'open' | 'close') => {
    if (action === 'open' && !yearInput) {
      return setModal({ isOpen: true, title: 'Input Required', message: 'Please enter an academic year (e.g., 2026-27).', isError: true });
    }
    setLoading(true);
    try {
      if (action === 'open') {
        await adminAdmissionService.openAdmission(yearInput);
      } else {
        await adminAdmissionService.closeAdmission(activeYear);
      }
      await refreshSession();
      setYearInput('');
    } catch (error: any) {
      setModal({ isOpen: true, title: 'Error', message: error.response?.data?.message || 'Action failed to execute.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ConfirmationModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ ...modal, isOpen: false })} 
        title={modal.title} 
        message={modal.message} 
        isError={modal.isError} 
      />
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shadow-sm">
        <div>
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Status</h2>
          {activeYear ? (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#59B292] animate-pulse shadow-[0_0_8px_rgba(89,178,146,0.6)]"></span>
              <span className="text-lg font-extrabold text-slate-800">Admissions Open ({activeYear})</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-lg font-extrabold text-slate-800">Admissions Closed</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!activeYear ? (
            <>
              <input 
                type="text" 
                placeholder="e.g., 2026-27" 
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#093C5D] w-full sm:w-36 transition-all"
              />
              <button 
                onClick={() => handleAction('open')} disabled={loading}
                className="bg-[#FA6781] hover:bg-[#093C5D] text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all border-0 cursor-pointer disabled:opacity-70 whitespace-nowrap shadow-xs"
              >
                {loading ? 'Opening...' : 'Open Session'}
              </button>
            </>
          ) : (
            <button 
              onClick={() => handleAction('close')} disabled={loading}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-5 py-2 rounded-xl text-xs font-semibold border-1 cursor-pointer transition-all disabled:opacity-70 whitespace-nowrap"
            >
              {loading ? 'Closing...' : 'Close Current Session'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}