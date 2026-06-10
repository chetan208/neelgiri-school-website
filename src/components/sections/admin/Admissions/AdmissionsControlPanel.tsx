'use client';

import React, { useState, useEffect } from 'react';
import { adminAdmissionService } from './adminAdmissionService';
import SessionManager from './SessionManager';
import AdmissionTable from './AdmissionTable';
import ApplicationDetailsModal from './ApplicationDetailsModal';

export default function AdmissionsControlPanel() {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [activeYear, setActiveYear] = useState<string | null>(null);
  
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [page, setPage] = useState(1);
  
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'id'>('name');
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const fetchSession = async () => {
    try {
      const res = await adminAdmissionService.getActiveYear();
      setActiveYear(res.year);
    } catch (e) { 
      console.error("Session fetch failed", e); 
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let res;
      const queryYear = activeYear || '2026-27'; 
      
      if (activeTab === 'pending') {
        res = await adminAdmissionService.getPending(page, 10, search, searchType, queryYear);
        setData(res.admissions || res.admissionDetails || []);
      } else {
        res = await adminAdmissionService.getCompleted(page, 10, queryYear);
        setData(res.admissionDetails || []);
      }
      
      setPagination({ 
        currentPage: res.currentPage || 1, 
        totalPages: res.totalPages || 1, 
        totalCount: res.totalCount || 0 
      });
    } catch (e) {
      console.error(e);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchSession(); 
  }, []);
  
  useEffect(() => { 
    fetchData(); 
  }, [activeTab, page, search, searchType, activeYear]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <ApplicationDetailsModal 
        isOpen={!!selectedApplication} 
        onClose={() => setSelectedApplication(null)} 
        data={selectedApplication} 
      />

      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Admission Control Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Manage enrollments, approve student applications, and monitor sessions.</p>
        </header>

        <SessionManager activeYear={activeYear} refreshSession={fetchSession} />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex bg-slate-200/50 p-1.5 rounded-xl w-full sm:w-auto border border-[#093C5D]/10">
            <button 
              onClick={() => { setActiveTab('pending'); setPage(1); setSearch(''); }}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer ${activeTab === 'pending' ? 'bg-white text-[#093C5D] shadow-sm' : 'text-slate-500 bg-transparent hover:text-slate-700'}`}
            >
              Pending Requests
            </button>
            <button 
              onClick={() => { setActiveTab('completed'); setPage(1); setSearch(''); }}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer ${activeTab === 'completed' ? 'bg-white text-[#093C5D] shadow-sm' : 'text-slate-500 bg-transparent hover:text-slate-700'}`}
            >
              Approved List
            </button>
          </div>

          {activeTab === 'pending' && (
            <div className="flex items-center bg-white border border-[#093C5D]/15 rounded-xl shadow-sm w-full lg:w-96 overflow-hidden">
              <select 
                value={searchType} 
                onChange={(e) => { setSearchType(e.target.value as 'name' | 'id'); setSearch(''); }}
                className="bg-slate-50 border-0 border-r border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
              >
                <option value="name">Name</option>
                <option value="id">App ID</option>
              </select>
              <input 
                type="text" 
                placeholder={`Search by ${searchType === 'name' ? 'student name' : 'ID'}...`} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 text-xs focus:outline-none"
              />
            </div>
          )}
        </div>

        <AdmissionTable 
          data={data} 
          type={activeTab} 
          refreshData={fetchData} 
          pagination={pagination}
          setPage={setPage}
          isLoading={isLoading}
          onViewDetails={(app: any) => setSelectedApplication(app)}
        />
      </div>
    </div>
  );
}