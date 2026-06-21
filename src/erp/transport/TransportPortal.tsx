'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Bus, Save, Loader2, Users, MapPin, AlertCircle, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

interface StationFee {
  station: string;
  amount: number;
}

interface StationStudent {
  id: string;
  name: string;
  studentClass: string;
  cardNo: string;
  station: string | null;
}

export default function TransportPortal() {
  const { user } = useAuth();
  const isOwner = user?.role === "Owner";

  const [tab, setTab] = useState<"rates" | "students">("rates");
  const [stationFees, setStationFees] = useState<StationFee[]>([]);
  const [editAmounts, setEditAmounts] = useState<Record<string, string>>({});
  const [savingStation, setSavingStation] = useState<string | null>(null);
  const [grouped, setGrouped] = useState<Record<string, StationStudent[]>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newStationName, setNewStationName] = useState("");
  const [newStationAmount, setNewStationAmount] = useState("");

  useEffect(() => {
    fetchStationFees();
    fetchGrouped();
  }, []);

  const fetchStationFees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/transport/fees`, { withCredentials: true });
      const fees: StationFee[] = res.data.stationFees;
      setStationFees(fees);
      const map: Record<string, string> = {};
      for (const f of fees) map[f.station] = f.amount > 0 ? String(f.amount) : "";
      setEditAmounts(map);
    } catch {
      setMessage({ type: "error", text: "Failed to load station fees." });
    } finally {
      setLoading(false);
    }
  };

  const fetchGrouped = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/transport/students`, { withCredentials: true });
      setGrouped(res.data.grouped);
    } catch {
      // silent — not critical
    }
  };

  const saveStationFee = async (station: string) => {
    if (!isOwner) return;
    const amount = parseFloat(editAmounts[station] || "0");
    if (isNaN(amount) || amount < 0) {
      setMessage({ type: "error", text: "Enter a valid amount." });
      return;
    }
    setSavingStation(station);
    setMessage(null);
    try {
      await axios.put(`${SERVER_URL}/api/erp/transport/fees/${encodeURIComponent(station)}`, { amount }, { withCredentials: true });
      setStationFees(prev => prev.map(f => f.station === station ? { ...f, amount } : f));
      setMessage({ type: "success", text: `Rate saved for ${station}.` });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: "error", text: "Failed to save. Check your permissions." });
    } finally {
      setSavingStation(null);
    }
  };

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner || !newStationName.trim()) return;
    const amount = parseFloat(newStationAmount || "0");
    if (isNaN(amount) || amount < 0) {
      setMessage({ type: "error", text: "Enter a valid amount for new station." });
      return;
    }
    setSavingStation("new");
    setMessage(null);
    try {
      await axios.put(`${SERVER_URL}/api/erp/transport/fees/${encodeURIComponent(newStationName.trim())}`, { amount }, { withCredentials: true });
      setStationFees(prev => [...prev, { station: newStationName.trim(), amount }]);
      setEditAmounts(prev => ({ ...prev, [newStationName.trim()]: String(amount) }));
      setMessage({ type: "success", text: `Station ${newStationName} added.` });
      setNewStationName("");
      setNewStationAmount("");
      setTimeout(() => setMessage(null), 3000);
      fetchGrouped();
    } catch {
      setMessage({ type: "error", text: "Failed to add station." });
    } finally {
      setSavingStation(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#093C5D]/8 flex items-center justify-center">
            <Bus size={18} className="text-[#093C5D]" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#093C5D] uppercase tracking-wider">Transport Management</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{stationFees.length} active bus stations</p>
          </div>
        </div>
        {!isOwner && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
            <AlertCircle size={11} /> View Only
          </span>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`px-4 py-3 rounded-xl text-xs font-bold border ${
          message.type === "success"
            ? "bg-[#093C5D]/5 border-[#093C5D]/20 text-[#093C5D]"
            : "bg-rose-50 border-rose-200 text-rose-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {[
          { key: "rates", label: "Station Rates", icon: MapPin },
          { key: "students", label: "Station Summary", icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as "rates" | "students")}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition cursor-pointer border-0 ${
              tab === key ? "bg-[#093C5D] text-white shadow-sm" : "text-slate-500 hover:text-[#093C5D]"
            }`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* Station Rates Tab */}
      {tab === "rates" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {isOwner && (
            <div className="p-5 border-b border-slate-100 bg-slate-50/30">
              <form onSubmit={handleAddStation} className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">New Station Name</label>
                  <input
                    type="text"
                    required
                    value={newStationName}
                    onChange={(e) => setNewStationName(e.target.value)}
                    placeholder="e.g. Kangra"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D] transition-all"
                  />
                </div>
                <div className="w-full sm:w-40">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">Default Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">Rs.</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newStationAmount}
                      onChange={(e) => setNewStationAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D] transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={savingStation === "new" || !newStationName.trim()}
                  className="w-full sm:w-auto h-[42px] px-5 bg-[#093C5D] hover:bg-[#0b4870] disabled:bg-slate-300 text-white rounded-xl text-sm font-bold shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
                >
                  {savingStation === "new" ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Add</>}
                </button>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="grid grid-cols-12 text-xs font-black uppercase tracking-widest text-slate-400">
                  <span className="col-span-1">#</span>
                  <span className="col-span-5">Station Name</span>
                  <span className="col-span-3 text-right">Students</span>
                  <span className="col-span-3 text-right">Monthly Rate (Rs.)</span>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="animate-spin text-[#093C5D]" size={22} />
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {stationFees.map((fee, i) => {
                    const station = fee.station;
                    const studentCount = grouped[station]?.length ?? 0;
                    return (
                      <div key={station} className="grid grid-cols-12 items-center px-5 py-4 hover:bg-slate-50/50 transition">
                        <span className="col-span-1 text-xs font-bold text-slate-350">{i + 1}</span>
                        <div className="col-span-5">
                          <p className="text-sm font-black text-slate-700">{station}</p>
                        </div>
                        <div className="col-span-3 text-right">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                            <Users size={11} className="text-slate-400" /> {studentCount}
                          </span>
                        </div>
                        <div className="col-span-3 flex items-center justify-end gap-1.5">
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">Rs.</span>
                            <input
                              type="number"
                              min="0"
                              disabled={!isOwner}
                              value={editAmounts[station] ?? ""}
                              onChange={e => setEditAmounts(prev => ({ ...prev, [station]: e.target.value }))}
                              placeholder="0"
                              className={`w-28 pl-8 pr-2 py-1.5 text-xs font-mono font-bold border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#093C5D]/15 focus:border-[#093C5D] transition-all ${
                                isOwner ? "bg-slate-50 border-slate-200 text-slate-800" : "bg-slate-50/40 border-slate-100 text-slate-400 cursor-not-allowed"
                              }`}
                            />
                          </div>
                          {isOwner && (
                            <button
                              onClick={() => saveStationFee(station)}
                              disabled={savingStation === station}
                              className="w-7 h-7 flex items-center justify-center bg-[#093C5D] hover:bg-[#0b4870] text-white rounded-lg border-0 cursor-pointer transition active:scale-95 shrink-0"
                            >
                              {savingStation === station
                                ? <Loader2 size={11} className="animate-spin" />
                                : <Save size={11} />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Station Summary Tab */}
      {tab === "students" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...stationFees.map(f => f.station), "No Station"].map(station => {
            const students = grouped[station] ?? [];
            return (
              <div key={station} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <p className="text-sm font-black text-slate-700 truncate">{station}</p>
                  <span className="text-xs font-black text-[#093C5D] bg-[#093C5D]/8 border border-[#093C5D]/15 px-2 py-0.5 rounded-lg shrink-0">
                    {students.length}
                  </span>
                </div>
                {students.length > 0 ? (
                  <div className="divide-y divide-slate-50 max-h-48 overflow-y-auto">
                    {students.map(s => (
                      <div key={s.id} className="px-4 py-2.5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-700">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{s.studentClass}</p>
                        </div>
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {s.cardNo}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="px-4 py-3.5 text-xs text-slate-400 italic">No students assigned</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
