'use client';

import { useState, useEffect, useRef } from "react";
import { Bell, ArrowUpRight, ArrowRight, Radio } from "lucide-react";
import axios from "axios";
import Link from "next/link";
// Agar aapka NoticeCard component kisi specific directory mein hai, toh uska path check kar lein
// Agar error aaye toh relative path use karein jaise: import NoticeCard from "@/components/NoticeCard";
import NoticeCard from "./NoticeCard"; 

// ── TypeScript Types Definitions ──
interface NoticeType {
  id: string | number;
  type: string;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  link?: string;
  badgeColor: string;
}

interface StatsType {
  urgent: number;
  academic: number;
  careers: number;
}

interface TickerProps {
  notices: NoticeType[];
  visible: boolean;
  loading: boolean;
}

// ── Custom Intersection Observer Hook ──
function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ── 1. Dynamic Live Marquee Ticker Component ──
function Ticker({ notices, visible, loading }: TickerProps) {
  return (
    <div className={`bg-white border border-[#093C5D]/10 rounded-2xl p-2.5 mb-6 flex items-center gap-3 shadow-sm overflow-hidden transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}>
      <span className="shrink-0 flex items-center gap-1.5 bg-[#FA6781] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-xl shadow-xs">
        <Radio size={11} className="animate-pulse" /> Live
      </span>
      <div className="flex-1 overflow-hidden relative mask-gradient">
        {loading ? (
          <div className="h-3 bg-slate-200 rounded-sm w-2/3 animate-pulse mx-4"></div>
        ) : notices.length > 0 ? (
          <div className="inline-block whitespace-nowrap animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
            {[...notices, ...notices].map((n, i) => (
              <span key={i} className="inline-flex items-center gap-2 mx-8 text-xs font-bold text-[#06283D]/70 hover:text-[#093C5D] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FA6781] shrink-0 animate-ping" />
                {n.title}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs font-semibold text-slate-400 mx-4">No critical notifications active today.</span>
        )}
      </div>
    </div>
  );
}

const getBadgeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "urgent":
      return "bg-[#FA6781]/10 text-[#FA6781] ring-[#FA6781]/20 border-[#FA6781]/20";
    case "academic":
      return "bg-[#093C5D]/10 text-[#093C5D] ring-[#093C5D]/20 border-[#093C5D]/20";
    case "careers":
      return "bg-[#FFC94D]/15 text-[#093C5D] ring-[#FFC94D]/25 border-[#FFC94D]/25";
    default:
      return "bg-slate-50 text-[#06283D]/70 ring-[#093C5D]/10 border-[#093C5D]/10";
  }
};

// ── Main Section Container Component ──
export default function NoticeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sectionVisible = useInView(sectionRef, 0.12);

  const [allNotices, setAllNoticesData] = useState<NoticeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<NoticeType | null>(null); 
  const [stats, setStats] = useState<StatsType>({ urgent: 0, academic: 0, careers: 0 });

  useEffect(() => {
    const getNotices = async () => {
      try {
        setLoading(true);
        const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
        const res = await axios.get(`${SERVER_URL}/api/notices`);
        
        const formattedNotices = res.data.map((notice: any) => ({
          id: notice.id,
          type: notice.type.charAt(0).toUpperCase() + notice.type.slice(1),
          title: notice.title,
          description: notice.description, 
          excerpt: notice.description.substring(0, 100) + "...",
          date: new Date(notice.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          }),
          link: notice.documentUrl,
          badgeColor: getBadgeColor(notice.type),
        }));

        setAllNoticesData(formattedNotices);

        const counts = res.data.reduce((acc: any, curr: any) => {
          const type = curr.type.toLowerCase();
          if (acc[type] !== undefined) acc[type]++;
          return acc;
        }, { urgent: 0, academic: 0, careers: 0 });
        setStats(counts);

      } catch (error) {
        console.error("error in fetching notices:", error);
      } finally {
        setLoading(false);
      }
    };

    getNotices();
  }, []);

  const displayNotices = allNotices.slice(0, 4);
  const tickerNotices = allNotices.filter(n => n.type.toLowerCase() === "urgent");
  const criticalFeeds = tickerNotices.length > 0 ? tickerNotices : allNotices;

  const PulseCardSkeleton = () => (
    <div className="w-full bg-white border border-[#093C5D]/10 rounded-xl p-4 flex items-center gap-4 animate-pulse">
      <div className="w-10 h-5 bg-[#F8FAFC] rounded shrink-0"></div>
      <div className="h-4 bg-[#F8FAFC] rounded w-4/5 flex-1"></div>
      <div className="w-4 h-4 bg-[#F8FAFC] rounded-full shrink-0"></div>
    </div>
  );

  return (
    <section ref={sectionRef} className="bg-[#F8FAFC] text-[#06283D] font-sans antialiased py-8 sm:py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        
        <Ticker notices={criticalFeeds} visible={sectionVisible} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-12 items-start">
          
          <div className={`flex flex-col gap-6 transition-all duration-700 ease-out delay-150 ${sectionVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}>
            <div className="space-y-3">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.18em] text-[#FA6781] uppercase">
                <Bell size={12} /> Desk Updates
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#093C5D] leading-[1.1] tracking-tight font-serif">
                Official<br />
                <span className="text-[#FA6781] font-light italic">Board</span><br />
                Notices
              </h2>
            </div>

            <div className={`hidden sm:grid grid-cols-3 gap-2 transition-all duration-700 ease-out delay-300 ${sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              {[
                { label: "Urgent", count: stats.urgent, color: "text-[#FA6781]" },
                { label: "Academic", count: stats.academic, color: "text-[#093C5D]" },
                { label: "Careers", count: stats.careers, color: "text-[#FFC94D]" },
              ].map(({ label, count, color }) => (
                <div key={label} className="bg-white border border-[#093C5D]/10 rounded-xl px-3 py-2.5 text-center shadow-sm">
                  {loading ? (
                    <div className="h-6 w-6 bg-[#F8FAFC] animate-pulse rounded mx-auto"></div>
                  ) : (
                    <p className={`text-xl font-black ${color}`}>{count}</p>
                  )}
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#06283D]/60 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="space-y-2.5">
              {loading ? (
                [...Array(4)].map((_, i) => <PulseCardSkeleton key={i} />)
              ) : displayNotices.length > 0 ? (
                displayNotices.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedNotice(item)} 
                    style={{ transitionDelay: sectionVisible ? `${idx * 60}ms` : "0ms" }}
                    className={`w-full group flex items-center gap-3 bg-white border border-[#093C5D]/10 rounded-xl px-4 py-3.5 shadow-sm hover:border-[#FFC94D]/50 hover:shadow-md hover:shadow-[#093C5D]/5 transition-all duration-300 ease-out ${sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  >
                    <span className="shrink-0 inline-flex items-center bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded animate-pulse">
                      NEW
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[#06283D] group-hover:text-[#093C5D] text-left truncate flex-1">
                      {item.title}
                    </p>
                    <ArrowUpRight size={14} className="text-[#FA6781] shrink-0 opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </button>
                ))
              ) : (
                <div className="text-center p-8 bg-white border border-[#093C5D]/10 rounded-xl text-[#06283D]/50 text-xs">No active board notices published.</div>
              )}
            </div>

            <div className={`mt-6 flex justify-center lg:justify-start transition-all duration-700 ease-out delay-500 ${sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <Link href="/all-notices" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#093C5D] text-white text-xs font-bold tracking-wide hover:bg-[#FA6781] shadow-md transition-all duration-200 group">
                View All Board Notices
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {selectedNotice && (
        <NoticeCard
          selectedNotice={selectedNotice}
          setSelectedNotice={(val: any) => setSelectedNotice(val)}
        />
      )}

      <style>{`
        @keyframes marquee {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent, #fff 8%, #fff 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #fff 8%, #fff 92%, transparent);
        }
      `}</style>
    </section>
  );
}