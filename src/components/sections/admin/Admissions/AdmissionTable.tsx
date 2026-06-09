'use client';

import React, { useState } from 'react';
import { adminAdmissionService } from './adminAdmissionService';
import ConfirmationModal from './ConfirmationModal';

interface AdmissionTableProps {
  data: any[];
  type: 'pending' | 'completed';
  refreshData: () => Promise<void>;
  pagination: { currentPage: number; totalPages: number; totalCount: number };
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  onViewDetails: (app: any) => void;
}

export default function AdmissionTable({ data, type, refreshData, pagination, setPage, isLoading, onViewDetails }: AdmissionTableProps) {
  const [modal, setModal] = useState({ isOpen: false, id: null as string | number | null, status: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const [selectedClass, setSelectedClass] = useState('');
  
  const classOptions = ["Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

  const confirmAction = async () => {
    if (!modal.id) return;
    try {
      await adminAdmissionService.updateStatus(modal.id, modal.status);
      await refreshData();
    } catch (err) { 
      setErrorModal({ isOpen: true, message: "Failed to update admission status. Please try again." });
    }
    setModal({ isOpen: false, id: null, status: '' });
  };

  const filteredData = selectedClass && data 
    ? data.filter(item => item.targetClass === selectedClass) 
    : data;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
      <ConfirmationModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={confirmAction}
        title="Confirm Status Update"
        message={`Are you sure you want to mark this application as ${modal.status}?`}
      />
      <ConfirmationModal 
        isOpen={errorModal.isOpen} 
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        title="Error"
        message={errorModal.message}
        isError={true}
      />

      <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filter Class:</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="">All Classes</option>
            {classOptions.map(cls => <option key={cls} value={cls}>{cls}</option>)}
          </select>
        </div>
        
        <button 
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-teal-600 rounded-lg text-xs font-semibold transition-all border-1 cursor-pointer disabled:opacity-50 font-sans"
        >
          <svg className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100">
            <tr>
              <th className="px-4 sm:px-6 py-4">Student Details</th>
              <th className="px-4 sm:px-6 py-4">Class</th>
              <th className="px-4 sm:px-6 py-4">Session</th>
              <th className="px-4 sm:px-6 py-4">Contact</th>
              <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24 mb-2"></div><div className="h-3 bg-slate-100 rounded w-32"></div></td>
                  <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-200 rounded w-10"></div></td>
                  <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
                  <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                  <td className="px-4 sm:px-6 py-4 flex justify-end gap-2"><div className="h-7 bg-slate-200 rounded w-14"></div></td>
                </tr>
              ))
            ) : filteredData && filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} onClick={() => onViewDetails(item)} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
                  <td className="px-4 sm:px-6 py-4 min-w-[150px]">
                    <div className="font-bold text-slate-800 break-words">{item.studentName}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">ID: {item.id} • Parent: {item.FatherName}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-semibold">{item.targetClass}</span></td>
                  <td className="px-4 sm:px-6 py-4"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[11px] font-bold">{item.year}</span></td>
                  <td className="px-4 sm:px-6 py-4 text-slate-500">
                    <div className="font-medium text-slate-700">{item.phoneNumber}</div>
                    <div className="text-[10px] mt-0.5">{item.email || 'N/A'}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    {type === 'pending' ? (
                      <div className="flex justify-end gap-1.5 flex-wrap sm:flex-nowrap">
                        <button onClick={(e) => { e.stopPropagation(); setModal({isOpen: true, id: item.id, status: 'APPROVED'}); }} className="px-2 py-1 border-0 cursor-pointer bg-emerald-50 text-emerald-700 text-[9px] font-black rounded hover:bg-emerald-100 transition-colors">APPROVE</button>
                        <button onClick={(e) => { e.stopPropagation(); setModal({isOpen: true, id: item.id, status: 'REJECTED'}); }} className="px-2 py-1 border-0 cursor-pointer bg-rose-50 text-rose-700 text-[9px] font-black rounded hover:bg-rose-100 transition-colors">REJECT</button>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">APPROVED</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-4 sm:px-6 py-12 text-center text-slate-400 font-medium">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {!isLoading && pagination?.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/50 mt-auto">
          <span className="text-xs text-slate-500 font-medium">Page {pagination.currentPage} of {pagination.totalPages}</span>
          <div className="flex gap-2">
            <button disabled={pagination.currentPage === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-slate-200 text-slate-600 bg-white rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer">Prev</button>
            <button disabled={pagination.currentPage === pagination.totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-slate-200 text-slate-600 bg-white rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}