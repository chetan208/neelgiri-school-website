'use client';

import React, { useState, useEffect } from "react";
import { Trash2, Search, Mail, Phone, Loader2, CheckCircle2, AlertTriangle, X, ShieldAlert, MessageSquare, Calendar, User, Reply } from "lucide-react";
import axios from "axios";

interface ContactMessageType {
  id: string | number;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  createdAt?: string;
}

export default function ContactManager() {
  const [messages, setMessages] = useState<ContactMessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageType | null>(null);

  const [popup, setPopup] = useState<{
    show: boolean;
    type: "success" | "confirm" | "error";
    title: string;
    message: string;
    onConfirm: (() => void) | null;
  }>({ show: false, type: "success", title: "", message: "", onConfirm: null });

  const triggerSuccessPopup = (title: string, message: string) => {
    setPopup({ show: true, type: "success", title, message, onConfirm: null });
  };

  const triggerConfirmPopup = (title: string, message: string, onConfirmAction: () => void) => {
    setPopup({ show: true, type: "confirm", title, message, onConfirm: onConfirmAction });
  };

  const triggerErrorPopup = (title: string, message: string) => {
    setPopup({ show: true, type: "error", title, message, onConfirm: null });
  };

  const closePopup = () => {
    if (deleteLoading) return;
    setPopup(prev => ({ ...prev, show: false }));
  };

  const fetchMessages = async () => {
    setLoading(true);
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    try {
      const res = await axios.get(`${SERVER_URL}/api/contact`, { withCredentials: true });
      if (res.data) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error("Error fetching contact messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredMessages.map(m => m.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string | number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleDeleteMessages = (idsToDelete: (string | number)[], countText: string) => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    triggerConfirmPopup(
      "Delete Inquiries",
      `Are you sure you want to permanently delete ${countText}? This action cannot be undone.`,
      async () => {
        setDeleteLoading(true);
        try {
          await axios.delete(`${SERVER_URL}/api/contact`, {
            data: { ids: idsToDelete },
            withCredentials: true
          });
          setMessages(prev => prev.filter(m => !idsToDelete.includes(m.id)));
          setSelectedIds(prev => {
            const next = new Set(prev);
            idsToDelete.forEach(id => next.delete(id));
            return next;
          });
          setDeleteLoading(false);
          closePopup();
          if (selectedMessage && idsToDelete.includes(selectedMessage.id)) {
            setSelectedMessage(null);
          }
          setTimeout(() => {
            triggerSuccessPopup("Inquiries Deleted", "The selected contact messages have been permanently removed.");
          }, 200);
        } catch (error: any) {
          console.error("Error deleting contact messages:", error);
          setDeleteLoading(false);
          closePopup();
          setTimeout(() => {
            const errMsg = error.response?.data?.message || "Failed to delete inquiries.";
            triggerErrorPopup("Deletion Failed", errMsg);
          }, 200);
        }
      }
    );
  };

  const handleReply = (msg: ContactMessageType) => {
    if (msg.email) {
      // Open default mail client
      window.location.href = `mailto:${msg.email}?subject=Reply to your inquiry - Neelgiri School`;
    } else if (msg.phoneNumber) {
      // Clean phone number (keep digits only) and launch WhatsApp Link
      const cleanNumber = msg.phoneNumber.replace(/[^\d]/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
  };

  const getReplyLabel = (msg: ContactMessageType) => {
    if (msg.email) return "Reply via Email";
    if (msg.phoneNumber) return "Reply via WhatsApp";
    return "Reply";
  };

  const filteredMessages = messages.filter((m) => {
    const query = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.phoneNumber.includes(query) ||
      m.message.toLowerCase().includes(query)
    );
  });

  const allFilteredSelected = filteredMessages.length > 0 && filteredMessages.every(m => selectedIds.has(m.id));

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">Contact Inquiries</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">View and manage messages submitted by website visitors.</p>
        </div>
        {selectedIds.size > 0 && (
          <button
            onClick={() => handleDeleteMessages(Array.from(selectedIds), `${selectedIds.size} selected message(s)`)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition shadow-2xs border-0 cursor-pointer w-full sm:w-auto"
          >
            <Trash2 size={16} /> Delete Selected ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search inquiries by sender details or message content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-sm rounded-lg focus:outline-none focus:border-[#093C5D] font-medium transition"
        />
      </div>

      {/* Messages List / Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2 animate-pulse">
            <Loader2 className="animate-spin text-[#093C5D]" size={28} />
            <p className="text-xs font-semibold uppercase tracking-wider">Loading Inquiries...</p>
          </div>
        ) : filteredMessages.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 w-12 border-0">
                      <input
                        type="checkbox"
                        checked={allFilteredSelected}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-[#093C5D] focus:ring-[#093C5D]"
                      />
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 w-1/4 border-0">Sender</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 w-1/2 border-0">Message Preview</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 w-1/6 border-0">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right w-28 border-0">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMessages.map((msg) => {
                    const isSelected = selectedIds.has(msg.id);
                    const formattedDate = msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";
                    return (
                      <tr key={msg.id} className={`hover:bg-slate-50/50 transition duration-150 cursor-pointer ${isSelected ? 'bg-slate-50/70' : ''}`} onClick={() => setSelectedMessage(msg)}>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(msg.id)}
                            className="rounded border-slate-300 text-[#093C5D] focus:ring-[#093C5D]"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-800 block truncate">{msg.name}</span>
                          <span className="text-xs text-slate-500 block truncate">{msg.email}</span>
                          {msg.phoneNumber && <span className="text-[10px] text-slate-400 block truncate mt-0.5">{msg.phoneNumber}</span>}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-medium text-slate-600 line-clamp-2 leading-relaxed">{msg.message}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                          {formattedDate}
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleReply(msg)}
                            disabled={!msg.email && !msg.phoneNumber}
                            title={getReplyLabel(msg)}
                            className="p-2 text-slate-400 hover:text-[#093C5D] hover:bg-[#093C5D]/5 rounded-lg transition border-0 bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Reply size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteMessages([msg.id], `this message from ${msg.name}`)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border-0 bg-transparent cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredMessages.map((msg) => {
                const isSelected = selectedIds.has(msg.id);
                const formattedDate = msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A";
                return (
                  <div key={msg.id} className={`p-4 space-y-3 cursor-pointer ${isSelected ? 'bg-slate-50/50' : ''}`} onClick={() => setSelectedMessage(msg)}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleSelectRow(msg.id)}
                          className="rounded border-slate-300 text-[#093C5D] focus:ring-[#093C5D]"
                        />
                        <div>
                          <span className="text-sm font-bold text-slate-800 block truncate">{msg.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{formattedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleReply(msg)}
                          disabled={!msg.email && !msg.phoneNumber}
                          title={getReplyLabel(msg)}
                          className="p-2 text-slate-400 hover:text-[#093C5D] hover:bg-[#093C5D]/5 rounded-lg transition border-0 bg-transparent cursor-pointer disabled:opacity-30"
                        >
                          <Reply size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMessages([msg.id], `this message from ${msg.name}`)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border-0 bg-transparent cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pl-6">{msg.message}</p>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium">
            {searchQuery ? "No contact inquiries match your search." : "No contact inquiries registered."}
          </div>
        )}
      </div>

      {/* Message Preview Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-[#06283D]/25 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#093C5D]">
                <MessageSquare size={18} />
                <h3 className="text-sm sm:text-base font-bold font-serif">Inquiry Details</h3>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Sender Name</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <User size={14} className="text-slate-400" />
                    {selectedMessage.name}
                  </div>
                </div>
                {selectedMessage.createdAt && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Submitted On</span>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(selectedMessage.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Email Address</span>
                  <a href={`mailto:${selectedMessage.email}`} className="flex items-center gap-2 text-sm font-semibold text-[#093C5D] hover:underline no-underline">
                    <Mail size={14} className="text-slate-400" />
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Phone Number</span>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    {selectedMessage.phoneNumber || <span className="text-slate-300 italic">Not Provided</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Message Body</span>
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => handleReply(selectedMessage)}
                disabled={!selectedMessage.email && !selectedMessage.phoneNumber}
                className="px-4 py-2 bg-[#093C5D] hover:bg-[#FA6781] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Reply size={14} /> {getReplyLabel(selectedMessage)}
              </button>
              <button
                onClick={() => handleDeleteMessages([selectedMessage.id], `this message from ${selectedMessage.name}`)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 border-0 cursor-pointer"
              >
                <Trash2 size={14} /> Delete
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition border-0 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Actions Popups */}
      {popup.show && (
        <div className="fixed inset-0 bg-[#06283D]/25 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150 relative">
            <button onClick={closePopup} disabled={deleteLoading} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition disabled:opacity-50 border-0 bg-transparent cursor-pointer">
              <X size={16} />
            </button>
            
            {popup.type === "success" && (
              <div className="mx-auto bg-[#59B292]/10 text-[#59B292] w-12 h-12 rounded-full flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
            )}

            {popup.type === "confirm" && (
              <div className="mx-auto bg-rose-50 text-rose-600 w-12 h-12 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
            )}

            {popup.type === "error" && (
              <div className="mx-auto bg-rose-50 text-rose-600 w-12 h-12 rounded-full flex items-center justify-center">
                <ShieldAlert size={24} />
              </div>
            )}

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">{popup.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1 leading-relaxed">{popup.message}</p>
            </div>

            <div className="flex gap-2 pt-2">
              {popup.type === "confirm" ? (
                <>
                  <button 
                    onClick={popup.onConfirm ?? undefined} 
                    disabled={deleteLoading} 
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-75 border-0 cursor-pointer"
                  >
                    {deleteLoading && <Loader2 size={14} className="animate-spin" />}
                    <span>Delete</span>
                  </button>
                  <button 
                    onClick={closePopup} 
                    disabled={deleteLoading} 
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-bold transition disabled:opacity-50 border-0 cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={closePopup} className="w-full py-2.5 bg-[#093C5D] hover:bg-[#06283D] text-white rounded-lg text-xs sm:text-sm font-bold transition border-0 cursor-pointer">
                  Acknowledge
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
