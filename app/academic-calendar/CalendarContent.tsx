"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Calendar as CalendarIcon, 
  CalendarX, 
  FileSpreadsheet, 
  Sparkles, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
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

export default function CalendarContent() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Month navigation states
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const res = await axios.get<CalendarEvent[]>(`${SERVER_URL}/api/calendar`);
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to load academic calendar", err);
        setError("Unable to load academic calendar. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchCalendar();
  }, []);

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

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "holiday":
        return <CalendarX className="w-4 h-4 text-rose-500 shrink-0" />;
      case "exam":
        return <FileSpreadsheet className="w-4 h-4 text-amber-500 shrink-0" />;
      case "event":
        return <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  // Dynamic Session Calculation (e.g. Y-(Y+1) or (Y-1)-Y)
  const getSessionString = () => {
    const focusDate = new Date(currentYear, currentMonth, 15);
    const year = focusDate.getFullYear();
    const march31 = new Date(year, 2, 31, 23, 59, 59, 999);
    if (focusDate.getTime() <= march31.getTime()) {
      return `Academic Session ${year - 1} - ${year}`;
    } else {
      return `Academic Session ${year} - ${year + 1}`;
    }
  };

  // Events occurring in the currently selected calendar month
  const activeMonthEvents = events.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const gridDays = getGridDays();
  const selectedDayEvents = getEventsForDay(selectedDate);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#093C5D] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#093C5D]/5 border border-[#093C5D]/10 text-xs font-bold uppercase tracking-wider select-none">
            <CalendarIcon size={13} className="text-[#093C5D]" />
            <span>{getSessionString()}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#093C5D] font-serif leading-tight">
            School Academic Calendar
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-500 leading-relaxed">
            Interactive calendar schedule for school term events, examinations, holidays, and announcements.
          </p>
        </div>

        {/* Loading / Error states */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-[#093C5D]/10 rounded-2xl shadow-sm">
            <div className="w-8 h-8 border-4 border-[#093C5D] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading Calendar Grid…</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-white border border-rose-100 rounded-2xl shadow-sm space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 text-rose-500">
              <CalendarX size={24} />
            </div>
            <p className="text-sm font-semibold text-rose-600">{error}</p>
          </div>
        )}

        {/* Main Grid Interface */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left: Interactive Grid Container */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
              
              {/* Grid Header Month Controls */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-bold text-slate-800 font-serif flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFC94D]" />
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 bg-slate-50 hover:bg-[#093C5D]/10 hover:text-[#093C5D] rounded-xl transition border-0 cursor-pointer text-[#093C5D]"
                  >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 bg-slate-50 hover:bg-[#093C5D]/10 hover:text-[#093C5D] rounded-xl transition border-0 cursor-pointer text-[#093C5D]"
                  >
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Weekdays Row */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Day Cells Grid */}
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
                        w-full aspect-square sm:aspect-[1.5/1] lg:aspect-[1.8/1] bg-white border rounded-xl flex flex-col p-1 justify-between items-start transition-all relative cursor-pointer group select-none text-left
                        ${day.isCurrentMonth ? "border-slate-200 text-slate-800 hover:border-[#093C5D]" : "border-slate-100 text-slate-300 opacity-40 hover:opacity-85"}
                        ${cellIsSelected ? "ring-2 ring-[#093C5D] border-transparent shadow-xs" : ""}
                        ${cellIsToday ? "border-[#FFC94D] bg-amber-50/10 font-bold" : ""}
                      `}
                    >
                      {/* Day Number */}
                      <span className={`text-[10px] sm:text-xs font-extrabold w-5 h-5 rounded-md flex items-center justify-center ${
                        cellIsToday ? "bg-[#FFC94D] text-[#093C5D]" : "text-slate-700"
                      }`}>
                        {day.date.getDate()}
                      </span>

                      {/* Desktop Events Stack */}
                      <div className="hidden md:flex flex-col gap-0.5 w-full mt-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((ev) => (
                          <div 
                            key={ev.id} 
                            className={`text-[8px] px-1 py-0.5 rounded-md border truncate font-bold uppercase tracking-tight ${getEventBadgeClass(ev.type)}`}
                          >
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[7px] text-slate-400 font-extrabold pl-1 mt-0.5">
                            + {dayEvents.length - 2} more
                          </div>
                        )}
                      </div>

                      {/* Mobile Events Dot Row */}
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

            {/* Right: Sidebar Panel */}
            <div className="space-y-6">
              
              {/* Selected Day Agenda card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  Agenda: {selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </h3>

                {selectedDayEvents.length > 0 ? (
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {selectedDayEvents.map((ev) => {
                      const badgeClass = getEventBadgeClass(ev.type);
                      const isRange = ev.endDate && !isSameDay(new Date(ev.date), new Date(ev.endDate));

                      return (
                        <div key={ev.id} className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border capitalize ${badgeClass}`}>
                              {ev.type}
                            </span>
                            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium">
                              {getEventIcon(ev.type)}
                            </div>
                          </div>
                          
                          <h4 className="text-xs font-extrabold text-slate-800 capitalize leading-snug">
                            {ev.title}
                          </h4>

                          {isRange && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold bg-white border border-slate-100 p-1.5 rounded-lg">
                              <Clock size={11} className="shrink-0" />
                              <span>
                                {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - {new Date(ev.endDate!).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </span>
                            </div>
                          )}

                          {ev.description && (
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {ev.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs italic font-medium">
                    No academic events scheduled on this day.
                  </div>
                )}
              </div>

              {/* Selected Month Overview list */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  Month Overview: {MONTH_NAMES[currentMonth]}
                </h3>

                {activeMonthEvents.length > 0 ? (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {activeMonthEvents.map((ev) => {
                      const evDate = new Date(ev.date);
                      const isRange = ev.endDate && !isSameDay(evDate, new Date(ev.endDate));

                      return (
                        <div key={ev.id} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                          <div className="w-10 h-10 bg-[#093C5D]/5 border border-[#093C5D]/10 rounded-xl flex flex-col items-center justify-center shrink-0">
                            <span className="text-xs font-extrabold text-[#093C5D]">
                              {evDate.getDate()}
                            </span>
                            <span className="text-[7px] uppercase tracking-wider text-slate-400 font-extrabold mt-0.5">
                              {evDate.toLocaleDateString("en-US", { weekday: "short" })}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-800 capitalize truncate">
                              {ev.title}
                            </h4>
                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
                              <span className={`text-[8px] font-bold capitalize ${
                                ev.type === "holiday" ? "text-rose-500" :
                                ev.type === "exam" ? "text-amber-500" :
                                "text-emerald-500"
                              }`}>
                                {ev.type}
                              </span>
                              {isRange && (
                                <span className="text-[8px] text-slate-400 font-bold bg-slate-100 px-1 py-0.5 rounded">
                                  Range Event
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

      </div>
    </div>
  );
}
