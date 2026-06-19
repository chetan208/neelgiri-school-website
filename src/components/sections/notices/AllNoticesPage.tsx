'use client';

import React, { useEffect, useState, useRef } from "react";
import { Clock3, Search, ArrowUpRight, AlertTriangle, ShieldCheck, Briefcase } from "lucide-react";
import axios from "axios";
import NoticeCard from "./NoticeCard";
import Skeleton from "./Skeleton";

export interface NoticeType {
  id: string | number;
  type: "Urgent" | "Academic" | "Careers" | string;
  title: string;
  excerpt: string;
  description?: string;
  date: string;
  link: string;
  badgeColor: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  Urgent: <AlertTriangle size={14} className="text-[#FA6781] shrink-0" />,
  Academic: <ShieldCheck size={14} className="text-[#093C5D] shrink-0" />,
  Careers: <Briefcase size={14} className="text-[#FFC94D] shrink-0" />,
};

export default function AllNoticesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedNotice, setSelectedNotice] = useState<NoticeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [allNoticesData, setAllNoticesData] = useState<NoticeType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastNoticeElementRef = useRef<HTMLDivElement | null>(null);

  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "urgent":
        return "bg-[#FA6781]/10 text-[#FA6781] border-[#FA6781]/20";
      case "academic":
        return "bg-[#093C5D]/10 text-[#093C5D] border-[#093C5D]/20";
      case "careers":
        return "bg-[#FFC94D]/15 text-[#093C5D] border-[#FFC94D]/25";
      default:
        return "bg-[#FFC94D] text-[#093C5D] border-[#FFC94D]";
    }
  };

  useEffect(() => {
    const getNotices = async () => {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
      try {
        setLoading(true);
        const res = await axios.get(`${SERVER_URL}/api/notices?page=${page}`);
        
        const formattedNotices: NoticeType[] = res.data.map((notice: any) => ({
          id: notice.id || notice._id,
          type: notice.type.charAt(0).toUpperCase() + notice.type.slice(1),
          title: notice.title,
          excerpt: notice.description ? (notice.description.length > 100 ? notice.description.substring(0, 100) + "..." : notice.description) : "",
          description: notice.description || "",
          date: new Date(notice.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          link: notice.documentUrl || "#",
          badgeColor: getBadgeColor(notice.type),
        }));

        if (res.data.length < 10) setHasMore(false);
        setAllNoticesData(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNew = formattedNotices.filter(n => !existingIds.has(n.id));
        return [...prev, ...uniqueNew];
});
      } catch (error) {
        console.error("Error in fetching notices:", error);
      } finally {
        setLoading(false);
      }
    };

    getNotices();
  }, [page]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    });

    if (lastNoticeElementRef.current) {
      observer.current.observe(lastNoticeElementRef.current);
    }
  }, [hasMore, allNoticesData, loading]);

  const filteredNotices = allNoticesData.filter((notice) => {
    const matchesTab = activeTab === "All" || notice.type === activeTab;
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#093C5D] font-sans antialiased relative">
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#06283D] font-serif">
            Official Notices Archive
          </h1>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-[#093C5D]/10 rounded-xl p-2.5 mb-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            {["All", "Urgent", "Academic", "Careers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#093C5D] border-[#093C5D] text-white"
                    : "bg-white text-[#06283D] border-[#093C5D]/20 hover:bg-[#F8FAFC]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#06283D]/60">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#093C5D]/20 text-[#093C5D] text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC94D]/20 focus:border-[#FFC94D] transition-all"
            />
          </div>
        </div>

        {/* Notices Feed List */}
        <div className="space-y-1.5">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice, index) => {
              const isLast = index === filteredNotices.length - 1;
              const item = (
                <button
                  onClick={() => setSelectedNotice(notice)}
                  className="w-full text-left block bg-white border border-[#093C5D]/10 rounded-xl p-3 shadow-2xs hover:border-[#FFC94D]/40 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-3 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                      <span className={`shrink-0 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${notice.badgeColor}`}>
                        {typeIcons[notice.type]}
                        <span className="hidden sm:inline">{notice.type}</span>
                      </span>

                      <div className="min-w-0 flex-1 lg:flex lg:items-center lg:gap-3">
                        <h2 className="text-xs sm:text-sm font-bold text-[#06283D] group-hover:text-[#FA6781] transition-colors duration-150 truncate">
                          {notice.title}
                        </h2>
                        {index < 5 && (
                          <span className="animate-pulse text-[8px] font-black text-[#FA6781] uppercase tracking-widest">
                            ● New
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-[10px] sm:text-xs text-[#06283D]/60 font-medium">
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Clock3 size={11} className="text-slate-300" />
                        {notice.date}
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-0.5 text-xs font-bold text-[#FA6781] group-hover:translate-x-0.5 transition-transform">
                        View <ArrowUpRight size={13} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </button>
              );

              return isLast ? (
                <div ref={lastNoticeElementRef} key={notice.id}>{item}</div>
              ) : (
                <div key={notice.id}>{item}</div>
              );
            })
          ) : !loading ? (
            <div className="bg-white border border-[#093C5D]/10 rounded-xl p-8 text-center shadow-2xs max-w-xs mx-auto mt-8">
              <h3 className="text-xs font-bold text-slate-800">No Notice found</h3>
            </div>
          ) : null}

          {loading && [...Array(4)].map((_, i) => <Skeleton key={i} />)}
        </div>
      </main>

      {/* Detail Popup Modal */}
      {selectedNotice && (
        <NoticeCard
          selectedNotice={selectedNotice}
          setSelectedNotice={setSelectedNotice}
          typeIcons={typeIcons}
        />
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}