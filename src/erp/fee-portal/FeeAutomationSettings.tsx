'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, Loader2, CalendarClock, Activity } from "lucide-react";
import { motion } from "framer-motion";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export default function FeeAutomationSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [startDay, setStartDay] = useState(1);
  const [windowDays, setWindowDays] = useState(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/fee-automation/settings`, { withCredentials: true });
      if (res.data.success && res.data.settings) {
        setIsEnabled(res.data.settings.isEnabled || false);
        setStartDay(res.data.settings.startDay || 1);
        setWindowDays(res.data.settings.windowDays || 3);
      }
    } catch (error) {
      console.error("Failed to load automation settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await axios.put(`${SERVER_URL}/api/erp/fee-automation/settings`, {
        isEnabled,
        startDay,
        windowDays
      }, { withCredentials: true });
      setMessage({ type: "success", text: "Automation settings saved successfully!" });
    } catch (error) {
      console.error("Failed to save automation settings", error);
      setMessage({ type: "error", text: "Failed to save settings." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#093C5D]" size={32} />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-[#093C5D]/5 flex items-center justify-center">
            <Activity className="text-[#093C5D]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#093C5D]">Fee Automation & Reminders</h2>
            <p className="text-sm text-slate-500 mt-1">Configure automatic background fee generation and WhatsApp reminders.</p>
          </div>
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-bold border ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-8 max-w-2xl">
          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <div>
              <h3 className="font-bold text-slate-800">Enable Automation</h3>
              <p className="text-xs text-slate-500 mt-0.5">Allow the system to automatically generate fees and send WhatsApp reminders.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#093C5D]"></div>
            </label>
          </div>

          {/* Configuration Inputs */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${!isEnabled ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Start Day of Month</label>
              <div className="relative">
                <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  value={startDay} 
                  onChange={(e) => setStartDay(parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#093C5D]"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'} of the month</option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 ml-1">The date when automation should begin generating fees.</p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Processing Window</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="1" 
                  max="15"
                  value={windowDays || ""}
                  onChange={(e) => setWindowDays(parseInt(e.target.value) || 1)}
                  className="w-24 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#093C5D]"
                />
                <span className="text-sm font-bold text-slate-600">Days</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Spreads out the messages over multiple days to prevent WhatsApp bans.</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 bg-[#093C5D] hover:bg-[#0b4870] text-white rounded-xl text-sm font-bold shadow-md transition-all disabled:bg-slate-300 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving Configuration..." : "Save Settings"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
