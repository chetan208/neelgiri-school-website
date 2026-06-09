'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { GraduationCap, TrendingUp, Trophy, Users } from "lucide-react";

const iconMap: Record<string, React.ComponentType<any>> = {
  GraduationCap: GraduationCap,
  TrendingUp: TrendingUp,
  Users: Users,
  Trophy: Trophy,
};

interface StatItem {
  iconName: string;
  statValue: string;
  statLabel: string;
}

export default function HeroStatsBar() {
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/school-stats`);
        if (response.data && response.data.length > 0) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="w-full px-4 sm:px-5">
      <div
        className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden border border-white/10"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        {stats.map((stat, i) => {
          const Icon = iconMap[stat.iconName] || GraduationCap;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 sm:px-5 py-4 sm:py-5 transition-all duration-300 hover:bg-white/[0.05] ${
                i !== stats.length - 1 ? "border-white/10" : ""
              } ${i % 2 === 0 ? "border-r md:border-r" : ""} ${i < 2 ? "border-b md:border-b-0" : ""} md:border-b-0`}
            >
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl shrink-0 flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#ffffff",
                }}
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-white font-black text-[15px] sm:text-[18px] lg:text-[22px] leading-none">
                  {stat.statValue}
                </p>
                <p className="text-white/60 uppercase tracking-[0.08em] font-semibold mt-1 text-[9px] sm:text-[10px] lg:text-[11px] whitespace-nowrap">
                  {stat.statLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}