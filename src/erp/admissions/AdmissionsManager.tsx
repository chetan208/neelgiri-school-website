'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Inbox, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export default function AdmissionsManager() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [controlYear, setControlYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Applications list states
  const [applications, setApplications] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Modal
  const [selectedApp, setSelectedApp] = useState<any>(null);

  // Feedback Alerts
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveYear();
  }, []);

  useEffect(() => {
    if (activeYear) {
      fetchApplications(1);
    } else {
      setApplications([]);
      setTotalCount(0);
    }
  }, [activeYear, activeTab]);

  const fetchActiveYear = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/admissions/active-admission-year`);
      if (res.data && res.data.year) {
        setActiveYear(res.data.year);
        setControlYear(res.data.year);
      } else {
        setActiveYear(null);
      }
    } catch (err) {
      console.error("Error fetching active admission year:", err);
    }
  };

  const fetchApplications = async (page = 1) => {
    if (!activeYear) return;
    setLoading(true);
    setError(null);
    try {
      const endpoint = activeTab === "pending" 
        ? `${SERVER_URL}/api/admissions/view-admissions` 
        : `${SERVER_URL}/api/admissions/complete-admission-details`;

      const res = await axios.get(endpoint, {
        params: { year: activeYear, pageNumber: page, pageSize: 10 },
        withCredentials: true
      });

      const data = res.data;
      if (data && data.admissionDetails) {
        setApplications(data.admissionDetails);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
        setCurrentPage(data.currentPage || 1);
      } else if (data && data.admissions) {
        setApplications(data.admissions);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
        setCurrentPage(data.currentPage || 1);
      } else {
        setApplications([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load admission applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdmissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!controlYear) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`${SERVER_URL}/api/admissions/open-admissions`, {
        year: controlYear
      }, { withCredentials: true });
      setSuccess(res.data.message || `Admissions opened successfully for session ${controlYear}.`);
      fetchActiveYear();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to open admissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAdmissions = async () => {
    if (!activeYear) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`${SERVER_URL}/api/admissions/close-admissions`, {
        year: activeYear
      }, { withCredentials: true });
      setSuccess(res.data.message || `Admissions closed successfully.`);
      setActiveYear(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to close admissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    setActionLoading(id);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.put(`${SERVER_URL}/api/admissions/update-admission-status/${id}`, {
        status
      }, { withCredentials: true });
      setSuccess(`Application status updated to ${status} successfully.`);
      setSelectedApp(null);
      fetchApplications(currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update application status.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
            <Inbox size={18} className="text-[#FA6781]" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#093C5D] uppercase tracking-wider">Admissions Management</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Manage online registrations and configurations</p>
          </div>
        </div>
      </div>

      {/* Control Panel Section */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-2">
          <h3 className="text-sm font-black text-[#093C5D] flex items-center gap-2">
            <Settings size={15} />
            Admission Gate Settings
          </h3>
          <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
            Opening admissions enables the online registration form on the public school website, allowing parents to submit candidacy details. It also auto-posts an academic announcement to the notice board.
          </p>
          
          <div className="pt-2">
            {activeYear ? (
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-emerald-800 text-xs font-black">
                <CheckCircle size={14} />
                ONLINE ADMISSIONS OPEN FOR SESSION: {activeYear}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-amber-800 text-xs font-black">
                <XCircle size={14} />
                ONLINE ADMISSIONS CLOSED
              </div>
            )}
          </div>
        </div>

        <div>
          {activeYear ? (
            <div className="space-y-3 bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
              <p className="text-xs font-bold text-[#093C5D]">Would you like to close registration applications?</p>
              <button
                onClick={handleCloseAdmissions}
                disabled={loading}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer border-0 active:scale-95 flex items-center justify-center gap-1.5"
              >
                {loading && <Loader2 size={12} className="animate-spin" />}
                Close Registrations
              </button>
            </div>
          ) : (
            <form onSubmit={handleOpenAdmissions} className="space-y-3 bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
              <p className="text-xs font-bold text-[#093C5D]">Specify the session year to open online admissions:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-2027"
                  value={controlYear}
                  onChange={(e) => setControlYear(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs font-bold text-[#093C5D] border border-slate-200 rounded-xl focus:outline-none focus:border-[#093C5D]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 bg-[#093C5D] hover:bg-[#001F42] text-white font-bold text-xs rounded-xl transition cursor-pointer border-0 active:scale-95 flex items-center justify-center gap-1"
                >
                  {loading && <Loader2 size={12} className="animate-spin" />}
                  Open Admissions
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Alert banners */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 text-xs font-bold">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold">
            <CheckCircle size={15} className="shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applications Table Workspace */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex border-b border-slate-200/60 p-0.5 space-x-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border-0 cursor-pointer transition ${
                activeTab === "pending" ? "bg-[#093C5D] text-white shadow-sm" : "text-slate-500 hover:text-[#093C5D] bg-transparent"
              }`}
            >
              Pending Applications
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border-0 cursor-pointer transition ${
                activeTab === "approved" ? "bg-[#093C5D] text-white shadow-sm" : "text-slate-500 hover:text-[#093C5D] bg-transparent"
              }`}
            >
              Approved Candidates
            </button>
          </div>

          <span className="text-xs text-slate-400 font-bold">Total Count: {totalCount}</span>
        </div>

        {/* Table representation */}
        <div className="border border-slate-200/60 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-semibold">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/60 text-[#093C5D]">
                  <th className="p-3 text-[10px] font-black uppercase tracking-wider">Applicant Name</th>
                  <th className="p-3 text-[10px] font-black uppercase tracking-wider">Target Class</th>
                  <th className="p-3 text-[10px] font-black uppercase tracking-wider">Father's Name</th>
                  <th className="p-3 text-[10px] font-black uppercase tracking-wider">Contact Number</th>
                  <th className="p-3 text-[10px] font-black uppercase tracking-wider">DOB</th>
                  <th className="p-3 text-right text-[10px] font-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">Loading applications queue...</td>
                  </tr>
                ) : !activeYear ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">Please open admissions for a session to load applications.</td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">No applications found in this queue.</td>
                  </tr>
                ) : applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-bold text-[#093C5D]">{app.studentName}</td>
                    <td className="p-3 font-bold text-slate-700">{app.targetClass}</td>
                    <td className="p-3">{app.FatherName}</td>
                    <td className="p-3">{app.phoneNumber}</td>
                    <td className="p-3">{new Date(app.dob).toLocaleDateString()}</td>
                    <td className="p-3 text-right flex justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#093C5D] text-slate-500 hover:text-[#093C5D] transition cursor-pointer bg-white text-[10px] font-bold"
                      >
                        Details
                      </button>
                      {activeTab === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(app.id, "APPROVED")}
                            disabled={actionLoading === app.id}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition cursor-pointer"
                          >
                            <CheckCircle size={13} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                            disabled={actionLoading === app.id}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition cursor-pointer"
                          >
                            <XCircle size={13} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] font-bold text-slate-400">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => fetchApplications(currentPage - 1)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50 transition"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={currentPage === totalPages || loading}
                onClick={() => fetchApplications(currentPage + 1)}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50 transition"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-6 relative text-slate-650">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer p-1"
            >
              <XCircle size={16} />
            </button>

            <div>
              <h3 className="text-sm font-black text-[#093C5D] leading-none">Application Details</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Review applicant candidacy details</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <User className="text-[#093C5D] shrink-0" size={16} />
                <div>
                  <p className="text-xs font-black text-[#093C5D] leading-none">{selectedApp.studentName}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Candidacy for Class: <strong className="text-[#FA6781]">{selectedApp.targetClass}</strong></p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-slate-400">Father's Name</p>
                  <p className="font-bold text-slate-700">{selectedApp.FatherName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-slate-400">Mother's Name</p>
                  <p className="font-bold text-slate-700">{selectedApp.MotherName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-slate-400">Date of Birth</p>
                  <p className="font-bold text-slate-700">{new Date(selectedApp.dob).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-slate-400">Admission Session</p>
                  <p className="font-bold text-slate-700">{selectedApp.year}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Phone size={13} className="text-slate-400 shrink-0" />
                  <span>{selectedApp.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Mail size={13} className="text-slate-400 shrink-0" />
                  <span>{selectedApp.email || "No email provided"}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{selectedApp.address}</span>
                </div>
              </div>

              {activeTab === "pending" && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, "APPROVED")}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition border-0 cursor-pointer active:scale-95"
                  >
                    Approve Candidate
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, "REJECTED")}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition border-0 cursor-pointer active:scale-95"
                  >
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
