'use client';

import { useState, useEffect, useRef } from "react";
import {
  CalendarDays, MapPin, Clock3, Users, ChevronRight,
  ArrowUpRight, Ticket, Trophy, FlaskConical, Music2,
  BookOpen, Dumbbell, Star,
} from "lucide-react";

/* ─────────────────────────────────────────────
   TypeScript Models Interfaces Declarations
───────────────────────────────────────────── */
interface DateType {
  day: string;
  month: string;
  year: string;
}

interface EventItemType {
  id: number;
  category: string;
  featured: boolean;
  title: string;
  description: string;
  date: DateType;
  time: string;
  venue: string;
  seats: number;
  registered: number;
  icon: React.ComponentType<any>;
  color: "amber" | "teal" | "rose" | "blue" | "violet" | "pink";
  image: string | null;
  tag: string;
  highlight: string;
}

interface CountdownDiffType {
  done: boolean;
  d?: number;
  h?: number;
  m?: number;
}

/* ─────────────────────── DATA ─────────────────────── */
const categories = [
  { key: "all",      label: "All Events" },
  { key: "academic", label: "Academic"   },
  { key: "cultural", label: "Cultural"   },
  { key: "sports",   label: "Sports"     },
  { key: "science",  label: "Science"    },
];

const events: EventItemType[] = [
  {
    id: 1,
    category: "academic",
    featured: true,
    title: "Inter-School Debate Championship 2024",
    description:
      "Students compete in parliamentary-style debates on contemporary topics. Open to Classes IX–XII. Prizes worth ₹50,000 and certificates for all participants.",
    date: { day: "18", month: "DEC", year: "2024" },
    time: "9:00 AM – 4:00 PM",
    venue: "Main Auditorium, Block A",
    seats: 320,
    registered: 218,
    icon: Trophy,
    color: "amber",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=75",
    tag: "Competition",
    highlight: "₹50K Prize Pool",
  },
  {
    id: 2,
    category: "science",
    featured: false,
    title: "Annual Science Olympiad & Exhibition",
    description:
      "Show-case your innovation at the school's biggest science event. Working models, experiments, and presentations judged by faculty and industry experts.",
    date: { day: "22", month: "DEC", year: "2024" },
    time: "10:00 AM – 5:00 PM",
    venue: "Science Block & Grounds",
    seats: 500,
    registered: 344,
    icon: FlaskConical,
    color: "teal",
    image: "https://images.unsplash.com/photo-1532094349884-543559c5f185?w=800&q=75",
    tag: "Exhibition",
    highlight: "Expert Judges",
  },
  {
    id: 3,
    category: "cultural",
    featured: false,
    title: "Utsav 2024 — Annual Cultural Festival",
    description:
      "Three days of music, classical dance, theatre, and visual arts. Featuring alumni performances and a live band night on Day 3.",
    date: { day: "10", month: "JAN", year: "2025" },
    time: "5:00 PM – 10:00 PM",
    venue: "Open-Air Amphitheatre",
    seats: 800,
    registered: 612,
    icon: Music2,
    color: "rose",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=75",
    tag: "Festival",
    highlight: "3-Day Event",
  },
  {
    id: 4,
    category: "sports",
    featured: false,
    title: "Inter-House Athletics Championship",
    description:
      "Track & field, relay races, and team sports. Compete for the coveted Neelgiri Gold Shield and accumulate points for your house.",
    date: { day: "15", month: "JAN", year: "2025" },
    time: "7:00 AM – 2:00 PM",
    venue: "Main Sports Ground",
    seats: 600,
    registered: 410,
    icon: Dumbbell,
    color: "blue",
    image: "https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=800&q=75",
    tag: "Championship",
    highlight: "Gold Shield",
  },
  {
    id: 5,
    category: "academic",
    featured: false,
    title: "National Mathematics Olympiad — School Round",
    description:
      "School-level qualifying round for the National Math Olympiad. Top 5 students advance to the district stage with coaching support.",
    date: { day: "28", month: "JAN", year: "2025" },
    time: "9:30 AM – 12:30 PM",
    venue: "Examination Hall, Block B",
    seats: 150,
    registered: 139,
    icon: BookOpen,
    color: "violet",
    image: null,
    tag: "Olympiad",
    highlight: "National Qualifier",
  },
  {
    id: 6,
    category: "cultural",
    featured: false,
    title: "Classical Arts Recital — Spring Evening",
    description:
      "An intimate evening of Bharatanatyam, Carnatic vocals, and tabla performance by students of the school's fine arts programme.",
    date: { day: "05", month: "FEB", year: "2025" },
    time: "6:00 PM – 8:30 PM",
    venue: "Performing Arts Hall",
    seats: 200,
    registered: 88,
    icon: Star,
    color: "pink",
    image: null,
    tag: "Recital",
    highlight: "Fine Arts",
  },
];

/* ─────────────────────── COLOR MAP ─────────────────────── */
const colorMap = {
  amber: {
    pill:    "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    accent:  "bg-amber-500",
    dateBg:  "bg-amber-500",
    iconBg:  "bg-amber-50 text-amber-600",
    bar:     "bg-amber-400",
    hlBg:    "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  },
  teal: {
    pill:    "bg-teal-50 text-teal-800 ring-1 ring-teal-200",
    accent:  "bg-teal-500",
    dateBg:  "bg-teal-500",
    iconBg:  "bg-teal-50 text-teal-600",
    bar:     "bg-teal-400",
    hlBg:    "bg-teal-50 text-teal-800 ring-1 ring-teal-200",
  },
  rose: {
    pill:    "bg-rose-50 text-rose-800 ring-1 ring-rose-200",
    accent:  "bg-rose-500",
    dateBg:  "bg-rose-500",
    iconBg:  "bg-rose-50 text-rose-600",
    bar:     "bg-rose-400",
    hlBg:    "bg-rose-50 text-rose-800 ring-1 ring-rose-200",
  },
  blue: {
    pill:    "bg-blue-50 text-blue-800 ring-1 ring-blue-200",
    accent:  "bg-blue-500",
    dateBg:  "bg-blue-500",
    iconBg:  "bg-blue-50 text-blue-600",
    bar:     "bg-blue-400",
    hlBg:    "bg-blue-50 text-blue-800 ring-1 ring-blue-200",
  },
  violet: {
    pill:    "bg-violet-50 text-violet-800 ring-1 ring-violet-200",
    accent:  "bg-violet-500",
    dateBg:  "bg-violet-500",
    iconBg:  "bg-violet-50 text-violet-600",
    bar:     "bg-violet-400",
    hlBg:    "bg-violet-50 text-violet-800 ring-1 ring-violet-200",
  },
  pink: {
    pill:    "bg-pink-50 text-pink-800 ring-1 ring-pink-200",
    accent:  "bg-pink-500",
    dateBg:  "bg-pink-500",
    iconBg:  "bg-pink-50 text-pink-600",
    bar:     "bg-pink-400",
    hlBg:    "bg-pink-50 text-pink-800 ring-1 ring-pink-200",
  },
};

/* ─────────────────────── COUNTDOWN ─────────────────────── */
function useCountdown(day: string, month: string, year: string) {
  const [diff, setDiff] = useState<CountdownDiffType | null>(null);
  useEffect(() => {
    const monthMap: Record<string, number> = { JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11 };
    const target = new Date(parseInt(year), monthMap[month], parseInt(day));
    const calc = () => {
      const now = new Date();
      const ms = target.getTime() - now.getTime();
      if (ms <= 0) { setDiff({ done: true }); return; }
      setDiff({
        done: false,
        d: Math.floor(ms / 86400000),
        h: Math.floor((ms % 86400000) / 3600000),
        m: Math.floor((ms % 3600000) / 6000),
      });
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [day, month, year]);
  return diff;
}

/* ─────────────────────── FADE-IN HOOK ─────────────────────── */
function useFadeIn(delay = 0): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return [ref, visible];
}

/* ─────────────────────── SEAT PROGRESS ─────────────────────── */
function SeatBar({ seats, registered, color }: { seats: number; registered: number; color: keyof typeof colorMap }) {
  const pct = Math.round((registered / seats) * 100);
  const c = colorMap[color];
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Users size={10} strokeWidth={2}/> {registered}/{seats} registered
        </span>
        <span className="text-[10px] font-semibold text-slate-500">{pct}%</span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${c.bar}`} style={{ width: `${pct}%` }}/>
      </div>
    </div>
  );
}

/* ─────────────────────── COUNTDOWN BADGE ─────────────────────── */
function CountdownBadge({ day, month, year }: DateType) {
  const diff = useCountdown(day, month, year);
  if (!diff) return null;
  if (diff.done) return (
    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 px-2 py-0.5 rounded-full">
      Today!
    </span>
  );
  return (
    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full tabular-nums">
      {diff.d}d {diff.h}h {diff.m}m left
    </span>
  );
}

/* ─────────────────────── FEATURED CARD ─────────────────────── */
function FeaturedEventCard({ event }: { event: EventItemType }) {
  const [ref, visible] = useFadeIn(50);
  const c = colorMap[event.color];
  const EventIcon = event.icon;
  return (
    <article
      ref={ref as any}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm h-full cursor-pointer
        transition-all duration-600 ease-out hover:shadow-lg hover:-translate-y-0.5
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <div className="relative overflow-hidden h-[175px] flex-shrink-0">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent"/>
        <div className={`absolute bottom-3 left-3 flex flex-col items-center justify-center w-12 h-12 rounded-xl text-white ${c.dateBg}`}>
          <span className="text-[17px] font-black leading-none">{event.date.day}</span>
          <span className="text-[9px] font-bold tracking-wider leading-none mt-0.5">{event.date.month}</span>
        </div>
        <span className={`absolute top-3 right-3 text-[9px] font-semibold px-2 py-1 rounded-full ${c.pill}`}>
          {event.tag}
        </span>
        <span className="absolute bottom-3 right-3 text-[9px] font-bold text-white bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
          {event.highlight}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div className="flex items-start gap-2.5">
          <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${c.iconBg}`}>
            <EventIcon size={13} strokeWidth={2}/>
          </div>
          <h2 className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors duration-250">
            {event.title}
          </h2>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 flex-1">
          {event.description}
        </p>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10.5px] text-slate-400">
          <span className="flex items-center gap-1.5 truncate">
            <Clock3 size={10} strokeWidth={2} className="flex-shrink-0"/> {event.time}
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <MapPin size={10} strokeWidth={2} className="flex-shrink-0"/> {event.venue}
          </span>
        </div>

        <SeatBar seats={event.seats} registered={event.registered} color={event.color}/>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <CountdownBadge {...event.date}/>
          <span className="flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600
            opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-250 cursor-pointer whitespace-nowrap">
            Register <ArrowUpRight size={11} strokeWidth={2.5}/>
          </span>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────── LIST CARD ─────────────────────── */
function EventListCard({ event, index }: { event: EventItemType; index: number }) {
  const [ref, visible] = useFadeIn(80 + index * 55);
  const c = colorMap[event.color];
  return (
    <article
      ref={ref as any}
      className={`group flex gap-3 bg-white border border-slate-100 rounded-xl p-3 cursor-pointer
        hover:border-slate-200 hover:shadow-sm
        transition-all duration-400 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className={`flex-shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-xl text-white ${c.dateBg}`}>
        <span className="text-[14px] font-black leading-none">{event.date.day}</span>
        <span className="text-[8px] font-bold tracking-wider leading-none mt-0.5">{event.date.month}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[11.5px] font-bold text-slate-700 leading-snug group-hover:text-emerald-700 transition-colors duration-250 line-clamp-2">
            {event.title}
          </h3>
          <span className={`flex-shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${c.pill}`}>
            {event.tag}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-1.5">
          <span className="flex items-center gap-1"><Clock3 size={9} strokeWidth={2}/>{event.time.split("–")[0].trim()}</span>
          <span className="flex items-center gap-1 truncate"><MapPin size={9} strokeWidth={2}/>{event.venue.split(",")[0]}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-0.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${c.bar}`}
              style={{ width: `${Math.round((event.registered/event.seats)*100)}%` }}/>
          </div>
          <span className="text-[9.5px] text-slate-400 whitespace-nowrap flex-shrink-0">
            {event.seats - event.registered} seats left
          </span>
        </div>
      </div>

      <ChevronRight size={13} strokeWidth={2}
        className="self-center flex-shrink-0 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all duration-250"/>
    </article>
  );
}

/* ─────────────────────── MAIN SECTION ─────────────────────── */
export default function EventsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [hRef, hVisible] = useFadeIn(0);

  const filtered = activeFilter === "all"
    ? events
    : events.filter((e) => e.category === activeFilter);

  const featured  = filtered.find((e) => e.featured) || filtered[0];
  const listItems = filtered.filter((e) => e.id !== featured?.id).slice(0, 4);

  return (
    <section
      className="bg-white py-6 px-4 sm:px-6 lg:px-8 font-sans border-t border-slate-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">

        <div
          ref={hRef as any}
          className={`flex items-center justify-between mb-4 gap-4 flex-wrap
            transition-all duration-500 ease-out
            ${hVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-emerald-600 uppercase mb-0.5 flex items-center gap-1.5">
              <CalendarDays size={11} strokeWidth={2.5}/> Upcoming Events
            </p>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              Events &amp; Activities
            </h1>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200
                  ${activeFilter === cat.key
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <a href="#"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600
              hover:text-emerald-800 transition-colors duration-200 group pb-0.5 border-b border-emerald-200 hover:border-emerald-600 whitespace-nowrap flex-shrink-0">
            Full Calendar
            <ChevronRight size={12} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200"/>
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Events This Term", value: events.length, icon: CalendarDays },
            { label: "Total Seats Available", value: events.reduce((a, e) => a + e.seats, 0).toLocaleString(), icon: Ticket },
            { label: "Students Registered", value: events.reduce((a, e) => a + e.registered, 0).toLocaleString(), icon: Users },
          ].map(({ label, value, icon: Icon }, i) => (
            <div key={i} className="bg-slate-50 rounded-xl px-3 py-2.5 flex items-center gap-2.5 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Icon size={14} strokeWidth={2}/>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 leading-none mb-0.5">{label}</div>
                <div className="text-[15px] font-bold text-slate-800">{value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-4 lg:h-[calc(100vh-320px)] lg:max-h-[430px]">
          {featured && (
            <div className="h-full min-h-0">
              <FeaturedEventCard event={featured}/>
            </div>
          )}

          <div className="flex flex-col h-full min-h-0 gap-2">
            <div className="flex items-center justify-between flex-shrink-0">
              <h2 className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                Upcoming Schedule
              </h2>
              <span className="text-[10px] text-slate-400">{listItems.length} events</span>
            </div>

            <div className="flex flex-col gap-2 flex-1 overflow-hidden">
              {listItems.length > 0 ? listItems.map((ev, i) => (
                <EventListCard key={ev.id} event={ev} index={i}/>
              )) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                  No other events in this category
                </div>
              )}
            </div>

            <button className="flex-shrink-0 mt-1 w-full py-2 text-[11px] font-semibold text-emerald-600
              border border-emerald-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-400
              transition-all duration-200 group">
              <span className="flex items-center justify-center gap-1.5">
                View all events &amp; register
                <ArrowUpRight size={11} strokeWidth={2.5}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"/>
              </span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}