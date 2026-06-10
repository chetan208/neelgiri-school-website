'use client';

import React, { useEffect, useState } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";

interface StatItemType {
  id: number;
  statLabel: string;
  statValue: string;
}

export default function StatsManager() {
  const [stats, setStats] = useState<StatItemType[]>([]);
  const [initialLoading, setInitialLoading] = useState(true); 
  const [saveLoading, setSaveLoading] = useState(false);       
  const [showModal, setShowModal] = useState(false);           
  const [inputValues, setInputValues] = useState<Record<number, string>>({});          

  const fetchStats = async () => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    try {
      const res = await axios.get(`${SERVER_URL}/api/school-stats`);
      if (res.data && res.data.length > 0) {
        setStats(res.data);
      } else {
        setStats([
          { id: 1, statLabel: "Students Enrolled", statValue: "12,000+" },
          { id: 2, statLabel: "Pass Rate", statValue: "98%" },
          { id: 3, statLabel: "Expert Faculty", statValue: "250+" },
          { id: 4, statLabel: "Years of Excellence", statValue: "30+" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleInputChange = (id: number, val: string) => {
    setInputValues(prev => ({ ...prev, [id]: val }));
  };

  const handleSave = async () => {
    setSaveLoading(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    
    const updatedStats = stats.map(s => 
      inputValues[s.id] !== undefined ? { ...s, statValue: inputValues[s.id] } : s
    );

    try {
      await axios.post(`${SERVER_URL}/api/school-stats`, { stats: updatedStats });
      setInputValues({}); 
      setShowModal(true);  
    } catch (error) {
      console.error("Error saving stats:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleStayOnPanel = () => {
    setShowModal(false);
    setInitialLoading(true); 
    fetchStats(); 
  };

  const SkeletonRow = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
      <div className="h-9 bg-slate-200 rounded-lg w-full"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 font-serif">Edit Dashboard Stats</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[#093C5D] text-white rounded-lg text-sm font-bold hover:bg-[#FA6781] transition disabled:opacity-70 disabled:cursor-not-allowed shadow-xs border-0 cursor-pointer"
          onClick={handleSave}
          disabled={initialLoading || saveLoading}
        >
          {saveLoading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saveLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-4">
        {initialLoading ? (
          [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
        ) : (
          stats.map((stat) => (
            <div key={stat.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-4 border border-slate-200/60 rounded-xl bg-slate-50/50">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.statLabel}</label>
                <p className="text-xs font-bold text-slate-700 mt-0.5">Current: <span className="text-[#59B292]">{stat.statValue}</span></p>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter new value"
                  value={inputValues[stat.id] || ""}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093C5D]/20 focus:border-[#093C5D] transition-all font-medium text-slate-800"
                  onChange={(e) => handleInputChange(stat.id, e.target.value)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#06283D]/20 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto bg-[#59B292]/10 text-[#59B292] w-12 h-12 rounded-full flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Stats Updated Successfully!</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">School live metrics have been updated globally.</p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => window.location.href = "/"}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition border-0 cursor-pointer"
              >
                Go to Home Page
              </button>
              <button
                onClick={handleStayOnPanel}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition border-0 cursor-pointer"
              >
                Stay at Admin Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}