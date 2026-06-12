"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  PlusCircle, 
  Trash2, 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  Loader2, 
  X, 
  Info,
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  type: string;
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8000";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarManager() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Month navigation states
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    isRange: false,
    type: "holiday",
  });

  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success"
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get<CalendarEvent[]>(`${SERVER_URL}/api/calendar`);
      setEvents(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to fetch calendar events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.type) {
      return showToast("Please fill in all required fields.", "error");
    }

    if (formData.isRange && !formData.endDate) {
      return showToast("Please select an end date for the date range.", "error");
    }

    if (formData.isRange && new Date(formData.endDate) < new Date(formData.date)) {
      return showToast("End date cannot be earlier than start date.", "error");
    }

    setActionLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        endDate: formData.isRange ? formData.endDate : null,
        type: formData.type
      };

      const res = await axios.post(
        `${SERVER_URL}/api/calendar/add`,
        payload,
        { withCredentials: true }
      );
      if (res.status === 201 || res.status === 200) {
        showToast("Calendar event created & notice published successfully!", "success");
        setIsModalOpen(false);
        setFormData({ 
          title: "", 
          description: "", 
          date: "", 
          endDate: "", 
          isRange: false, 
          type: "holiday" 
        });
        fetchEvents();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message ?? "Error creating event.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setActionLoading(true);
    try {
      const res = await axios.delete(
        `${SERVER_URL}/api/calendar/${deleteTargetId}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        showToast("Calendar event deleted successfully.", "success");
        setEvents((prev) => prev.filter((ev) => ev.id !== deleteTargetId));
      }
    } catch (err: any) {
      showToast(err.response?.data?.message ?? "Unable to delete event.", "error");
    } finally {
      setActionLoading(false);
      setDeleteTargetId(null);
    }
  };

  // Normalise Date comparison helper (ignores time)
  const getStartOfDay = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const isEventOnDay = (event: CalendarEvent, cellDate: Date) => {
    const cellTime = getStartOfDay(cellDate).getTime();
    const startTime = getStartOfDay(new Date(event.date)).getTime();
    if (event.endDate) {
      const endTime = getStartOfDay(new Date(event.endDate)).getTime();
      return cellTime >= startTime && cellTime <= endTime;
    }
    return cellTime === startTime;
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(e => isEventOnDay(e, date));
  };

  // Generate 42 calendar grid days
  const getGridDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDayOfWeek = firstDay.getDay(); // 0: Sun to 6: Sat
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const daysList: { date: Date; isCurrentMonth: boolean }[] = [];

    // Prev month padding days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      daysList.push({
        date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      daysList.push({
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true,
      });
    }

    // Next month padding days
    const remaining = 42 - daysList.length;
    for (let i = 1; i <= remaining; i++) {
      daysList.push({
        date: new Date(currentYear, currentMonth + 1, i),
        isCurrentMonth: false,
      });
    }

    return daysList;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const getEventBadgeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "holiday":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "exam":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "event":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getEventDotColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "holiday":
        return "bg-rose-500";
      case "exam":
        return "bg-amber-500";
      case "event":
        return "bg-emerald-500";
      default:
        return "bg-slate-400";
    }
  };

  const openAddModalWithDate = (date: Date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const dateStr = localDate.toISOString().split("T")[0];
    setFormData({
      title: "",
      description: "",
      date: dateStr,
      endDate: "",
      isRange: false,
      type: "holiday"
    });
    setIsModalOpen(true);
  };

  // Events occurring in the currently selected calendar month
  const activeMonthEvents = events.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const gridDays = getGridDays();
  const selectedDayEvents = getEventsForDay(selectedDate);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 text-slate-800 antialiased relative">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border w-[90vw] sm:w-auto max-w-sm ${
          toast.type === "error" ? "bg-red-50 border-red-100 text-red-700" : "bg-[#59B292]/10 border-[#59B292]/20 text-[#59B292]"
        }`}>
          {toast.type === "error" ? (
            <AlertTriangle size={15} className="shrink-0" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span className="text-xs font-bold tracking-wide break-words">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 font-serif">Manage Academic Calendar</h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Define school term events, examinations, holidays, and schedules.</p>
        </div>
        <button
          onClick={() => {
            const todayStr = new Date().toISOString().split("T")[0];
            setFormData({ title: "", description: "", date: todayStr, endDate: "", isRange: false, type: "holiday" });
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto bg-[#093C5D] hover:bg-[#FA6781] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-3xs border-0 cursor-pointer"
        >
          <PlusCircle size={14} /> Add Calendar Event
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="text-center p-8 bg-red-50 border border-red-100 rounded-2xl max-w-sm mx-auto space-y-3">
          <p className="text-xs text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg border-0 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Grid View */}
      {loading ? (
        <div className="flex justify-center py-20 bg-white border border-slate-100 rounded-2xl">
          <Loader2 className="animate-spin text-slate-400" size={24} />
        </div>
      ) : !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left: 7-Column Grid */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
            
            {/* Grid Header Controls */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 font-serif flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC94D]" />
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 bg-slate-50 hover:bg-[#093C5D]/10 hover:text-[#093C5D] rounded-xl transition border-0 cursor-pointer text-[#093C5D]"
                >
                  <ChevronLeft size={15} strokeWidth={2.5} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 bg-slate-50 hover:bg-[#093C5D]/10 hover:text-[#093C5D] rounded-xl transition border-0 cursor-pointer text-[#093C5D]"
                >
                  <ChevronRight size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Weekdays Row */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {gridDays.map((day, idx) => {
                const dayEvents = getEventsForDay(day.date);
                const cellIsToday = isToday(day.date);
                const cellIsSelected = isSameDay(day.date, selectedDate);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day.date)}
                    className={`
                      w-full aspect-square sm:aspect-[1.5/1] lg:aspect-[1.8/1] bg-white border rounded-xl flex flex-col p-1 sm:p-1.5 justify-between items-start transition-all relative cursor-pointer group select-none text-left
                      ${day.isCurrentMonth ? "border-slate-200 text-slate-800 hover:border-[#093C5D]" : "border-slate-100 text-slate-350 opacity-40 hover:opacity-85"}
                      ${cellIsSelected ? "ring-2 ring-[#093C5D] border-transparent shadow-xs" : ""}
                      ${cellIsToday ? "border-[#FFC94D] bg-amber-50/10 font-bold" : ""}
                    `}
                  >
                    <span className={`text-[10px] sm:text-xs font-extrabold w-4.5 h-4.5 rounded flex items-center justify-center ${
                      cellIsToday ? "bg-[#FFC94D] text-[#093C5D]" : "text-slate-600"
                    }`}>
                      {day.date.getDate()}
                    </span>

                    {/* Desktop indicators stack */}
                    <div className="hidden md:flex flex-col gap-0.5 w-full mt-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div 
                          key={ev.id} 
                          className={`text-[8px] px-1 py-0.5 rounded border truncate font-bold uppercase tracking-tight ${getEventBadgeClass(ev.type)}`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[7px] text-slate-400 font-black pl-1 mt-0.5">
                          + {dayEvents.length - 2} more
                        </div>
                      )}
                    </div>

                    {/* Mobile indicators dots */}
                    <div className="flex md:hidden justify-center gap-0.5 w-full mt-auto">
                      {dayEvents.map((ev) => (
                        <span 
                          key={ev.id} 
                          className={`w-1.5 h-1.5 rounded-full ${getEventDotColor(ev.type)}`} 
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right: Sidebar controls and agenda */}
          <div className="space-y-6">
            
            {/* Agenda Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Agenda: {selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
                </h3>
                <button
                  onClick={() => openAddModalWithDate(selectedDate)}
                  className="text-[10px] font-black uppercase tracking-wide text-[#093C5D] hover:text-[#FA6781] transition cursor-pointer border-0 bg-transparent flex items-center gap-1"
                >
                  <PlusCircle size={12} /> Add Here
                </button>
              </div>

              {selectedDayEvents.length > 0 ? (
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {selectedDayEvents.map((ev) => {
                    const badgeClass = getEventBadgeClass(ev.type);
                    const isRange = ev.endDate && !isSameDay(new Date(ev.date), new Date(ev.endDate));

                    return (
                      <div key={ev.id} className="p-3 border border-slate-150 bg-slate-50/50 rounded-xl flex items-start justify-between gap-3">
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border tracking-wider capitalize ${badgeClass}`}>
                              {ev.type}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 capitalize leading-snug">
                            {ev.title}
                          </h4>
                          {isRange && (
                            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold bg-white border border-slate-100 p-1 rounded-md w-fit">
                              <Clock size={10} />
                              <span>
                                {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - {new Date(ev.endDate!).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </span>
                            </div>
                          )}
                          {ev.description && (
                            <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                              {ev.description}
                            </p>
                          )}
                        </div>

                        <button
                          disabled={actionLoading}
                          onClick={() => setDeleteTargetId(ev.id)}
                          className="text-slate-350 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-all cursor-pointer bg-transparent border-0 shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs italic font-medium">
                  No events scheduled for this day.
                </div>
              )}
            </div>

            {/* Monthly Overview List */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Month Overview
              </h3>

              {activeMonthEvents.length > 0 ? (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {activeMonthEvents.map((ev) => {
                    const evDate = new Date(ev.date);
                    const isRange = ev.endDate && !isSameDay(evDate, new Date(ev.endDate));

                    return (
                      <div key={ev.id} className="flex items-start gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="w-9 h-9 bg-[#093C5D]/5 border border-[#093C5D]/10 rounded-xl flex flex-col items-center justify-center shrink-0">
                          <span className="text-xs font-black text-[#093C5D]">
                            {evDate.getDate()}
                          </span>
                          <span className="text-[7px] uppercase tracking-wider text-slate-400 font-extrabold leading-none mt-0.5">
                            {evDate.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-800 capitalize truncate">
                            {ev.title}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[8px] font-bold capitalize ${
                              ev.type === "holiday" ? "text-rose-500" :
                              ev.type === "exam" ? "text-amber-500" :
                              "text-emerald-500"
                            }`}>
                              {ev.type}
                            </span>
                            {isRange && (
                              <span className="text-[7px] text-slate-400 font-black bg-slate-100 px-1 rounded uppercase tracking-wide">
                                Range
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs italic font-medium">
                  No events scheduled for this month.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-[#06283D]/40 backdrop-blur-3xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-[#093C5D] flex items-center gap-1.5">
                <CalendarIcon size={14} /> Add Calendar Event
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              
              {/* Type Select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Event Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-lg outline-none cursor-pointer text-slate-700 capitalize"
                >
                  <option value="holiday">Holiday</option>
                  <option value="exam">Examination</option>
                  <option value="event">School Event</option>
                  <option value="other">Other Academic</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Vacation, Term-1 Exams"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-lg outline-none"
                />
              </div>

              {/* Date Spacing / Range Controls */}
              <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isRangeCheckbox"
                    checked={formData.isRange}
                    onChange={(e) => setFormData({ ...formData, isRange: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-slate-200 text-[#093C5D] focus:ring-[#093C5D] cursor-pointer"
                  />
                  <label htmlFor="isRangeCheckbox" className="text-xs font-bold text-slate-600 cursor-pointer select-none">
                    This is a multi-day date range event
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">
                      {formData.isRange ? "Start Date *" : "Date *"}
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-xs font-semibold p-2 rounded-lg outline-none text-slate-700"
                    />
                  </div>
                  {formData.isRange && (
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">End Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-xs font-semibold p-2 rounded-lg outline-none text-slate-700"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description (Optional)</label>
                <textarea
                  placeholder="Provide additional details..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-lg outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl text-xs bg-white cursor-pointer hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#FA6781] hover:bg-[#093C5D] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border-0 cursor-pointer shadow-xs transition"
                >
                  {actionLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                  <span>Publish Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#06283D]/40 backdrop-blur-3xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto bg-rose-50 text-rose-600 w-11 h-11 rounded-full flex items-center justify-center">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Calendar Event?</h3>
              <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                Are you sure you want to remove this event from the academic calendar? The corresponding published notice will remain in archives.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="flex-1 py-2 bg-[#FA6781] hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition border-0 cursor-pointer flex items-center justify-center gap-1"
              >
                {actionLoading && <Loader2 size={12} className="animate-spin" />}
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                disabled={actionLoading}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition border-0 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
