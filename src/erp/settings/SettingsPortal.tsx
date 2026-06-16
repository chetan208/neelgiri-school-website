'use client';

import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Settings, 
  Info,
  Calendar,
  Building2,
  PhoneCall
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPortal() {
  const [activeTab, setActiveTab] = useState<"whatsapp" | "general">("whatsapp");
  
  // WhatsApp States
  const [whatsappStatus, setWhatsappStatus] = useState<any>(null);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const prevQrCode = React.useRef<string | null>(null);

  useEffect(() => {
    if (whatsappStatus) {
      if (prevQrCode.current && !whatsappStatus.qrCode && !whatsappStatus.connected) {
        setIsScanning(true);
      }
      if (whatsappStatus.connected) {
        setIsScanning(false);
      }
      prevQrCode.current = whatsappStatus.qrCode;
    }
  }, [whatsappStatus]);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  // Fetch WhatsApp Status
  const fetchWhatsappStatus = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/erp/whatsapp/status`, { withCredentials: true });
      if (res.data.success) {
        setWhatsappStatus(res.data.status);
      }
    } catch (err) {
      console.error("Error fetching WhatsApp status:", err);
    }
  };

  // Disconnect WhatsApp
  const handleDisconnectWhatsapp = async () => {
    if (!confirm("Are you sure you want to disconnect this WhatsApp account?")) return;
    setWhatsappLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`${SERVER_URL}/api/erp/whatsapp/logout`, {}, { withCredentials: true });
      if (res.data.success) {
        setSuccess("WhatsApp disconnected successfully. New QR code generating...");
        fetchWhatsappStatus();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to disconnect WhatsApp.");
    } finally {
      setWhatsappLoading(false);
    }
  };

  // Poll WhatsApp status when tab is active
  useEffect(() => {
    if (activeTab !== "whatsapp") return;
    
    fetchWhatsappStatus();
    const interval = setInterval(fetchWhatsappStatus, 5000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="space-y-8">
      {/* Settings Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <h2 className="text-xl font-black text-[#093C5D]">ERP Portal Settings</h2>
          <p className="text-xs text-slate-450 font-semibold mt-1">Configure integrations, notifications, and school parameters.</p>
        </div>

        {/* Settings Sub-Tabs */}
        <div className="flex bg-slate-100 p-0.5 space-x-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => { setActiveTab("whatsapp"); setError(null); setSuccess(null); }}
            className={`px-4 py-1.5 rounded-lg text-[11px] font-bold border-0 cursor-pointer transition ${
              activeTab === "whatsapp" ? "bg-[#093C5D] text-white shadow-xs" : "text-slate-500 hover:text-[#093C5D] bg-transparent"
            }`}
          >
            WhatsApp Gateway
          </button>
          <button
            onClick={() => { setActiveTab("general"); setError(null); setSuccess(null); }}
            className={`px-4 py-1.5 rounded-lg text-[11px] font-bold border-0 cursor-pointer transition ${
              activeTab === "general" ? "bg-[#093C5D] text-white shadow-xs" : "text-slate-500 hover:text-[#093C5D] bg-transparent"
            }`}
          >
            General Settings
          </button>
        </div>
      </div>

      {/* Feedback Alert Banners */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }} 
            className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 text-xs font-bold"
          >
            <AlertTriangle size={15} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }} 
            className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold"
          >
            <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Contents */}
      <div className="min-h-[350px]">
        {activeTab === "whatsapp" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/50 p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-black text-[#093C5D] mb-1 flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#14B8A6]" />
                  WhatsApp Alerts Connection
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Link your school's WhatsApp account to enable automatic invoice delivery, fee collection alerts, and registration reminders to parents.
                </p>
              </div>

              {whatsappStatus === null ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin text-[#093C5D]" size={24} />
                </div>
              ) : whatsappStatus.connected ? (
                /* Connected State */
                <div className="bg-emerald-50/30 border border-emerald-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-650 rounded-2xl flex items-center justify-center font-black">
                      WA
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-[#093C5D]">System Connected</h4>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <p className="text-[11px] font-bold text-slate-600 mt-1.5">
                        Account: <span className="font-black text-[#093C5D]">{whatsappStatus.user?.name || "School Official"}</span>
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                        Phone Number: {whatsappStatus.user?.id ? whatsappStatus.user.id.split(":")[0] : "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    disabled={whatsappLoading}
                    onClick={handleDisconnectWhatsapp}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition border-0 cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
                  >
                    {whatsappLoading && <Loader2 className="animate-spin" size={13} />}
                    Disconnect Account
                  </button>
                </div>
              ) : (
                /* Disconnected State: Show QR Code */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-slate-200 rounded-3xl p-6 bg-slate-50/50">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-black text-[#093C5D]">Link Your WhatsApp Device</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Scan this secure QR Code from your phone's WhatsApp application to connect it to the Neelgiri Public School system.</p>
                    </div>

                    <div className="text-[10px] text-slate-500 font-medium space-y-2.5 leading-relaxed">
                      <p>1. Open WhatsApp on your phone.</p>
                      <p>2. Tap <strong>Menu</strong> (Android) or <strong>Settings</strong> (iOS) and select <strong>Linked Devices</strong>.</p>
                      <p>3. Tap on <strong>Link a Device</strong> and point your phone to the QR code on the right.</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-5 bg-white border border-slate-250/55 rounded-2xl shadow-xs min-h-[240px]">
                    {isScanning ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-48 h-48 flex flex-col items-center justify-center text-center space-y-5"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                          <div className="relative bg-emerald-100 text-emerald-600 p-4 rounded-full">
                            <CheckCircle2 size={32} />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-black text-[#093C5D]">QR Code Scanned!</h4>
                          <p className="text-[10px] text-slate-500 font-bold animate-pulse leading-relaxed">
                            Securely connecting and syncing with your WhatsApp account...
                          </p>
                        </div>
                      </motion.div>
                    ) : whatsappStatus.qrCode ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center"
                      >
                        <img 
                          src={whatsappStatus.qrCode} 
                          alt="WhatsApp QR Code" 
                          className="w-48 h-48 border border-slate-100 rounded-xl"
                        />
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider mt-3 animate-pulse">Waiting for device scan...</span>
                      </motion.div>
                    ) : (
                      <div className="w-48 h-48 flex flex-col items-center justify-center text-center text-slate-400 font-bold text-[10px] space-y-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Loader2 className="animate-spin text-[#093C5D]" size={16} />
                        <p>Generating new secure QR Code...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "general" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/50 p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-black text-[#093C5D] mb-1 flex items-center gap-2">
                  <Building2 size={16} className="text-[#093C5D]" />
                  School Information
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Basic administrative data configured for the school. Edit parameters through the root database system.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#093C5D]/10 text-[#093C5D] flex items-center justify-center shrink-0">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">School Name</p>
                    <p className="text-xs font-black text-[#093C5D] mt-0.5">Neelgiri Public Sen. Sec. School</p>
                  </div>
                </div>

                <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#093C5D]/10 text-[#093C5D] flex items-center justify-center shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Current Academic Year</p>
                    <p className="text-xs font-black text-[#093C5D] mt-0.5">2026-2027</p>
                  </div>
                </div>

                <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#093C5D]/10 text-[#093C5D] flex items-center justify-center shrink-0">
                    <PhoneCall size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Contact Number</p>
                    <p className="text-xs font-black text-[#093C5D] mt-0.5">+91 98051 69647</p>
                  </div>
                </div>

                <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#093C5D]/10 text-[#093C5D] flex items-center justify-center shrink-0">
                    <Info size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Board Affiliation</p>
                    <p className="text-xs font-black text-[#093C5D] mt-0.5">PSEB Board (Punjab)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
