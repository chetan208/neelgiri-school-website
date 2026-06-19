'use client';

import { useState, useEffect, useRef } from "react";
import { Target, Eye, CheckCircle2 } from "lucide-react";

const missionPoints = [
    "Strong foundation from early childhood (Nursery)",
      "Holistic development and regular career guidance",
      "Disciplined, value-based learning environment"
];
const visionPoints = [
  "Top-tier academic results in Higher Secondary boards",
      "Character building and rooted cultural values",
      "Preparing multi-talented leaders for tomorrow"
];

function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

interface CardProps {
  type: string;
  icon: React.ComponentType<any>;
  accentColor: string;
  iconBg: string;
  iconColor: string;
  tagBg: string;
  tagText: string;
  title: string;
  body: string;
  points: string[];
  visible: boolean;
  delay: number;
}

function Card({ type, icon: Icon, accentColor, iconBg, iconColor, tagBg, tagText, title, body, points, visible, delay }: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden border border-brand-bg-light bg-white flex flex-col"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms, box-shadow 0.3s ease`,
        boxShadow: hovered
          ? "0 20px 48px -12px rgba(0,43,91,0.16), 0 4px 12px -2px rgba(0,0,0,0.07)"
          : "0 2px 8px rgba(0,0,0,0.05)",
        borderTop: `3px solid ${accentColor}`,
      }}
    >
      <div className="relative z-10 p-7 sm:p-8 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div
            className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}
            style={{
              transform: hovered ? "rotate(-6deg) scale(1.08)" : "rotate(0deg) scale(1)",
              transition: "transform 0.3s ease",
            }}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full ${tagBg} ${tagText}`}>
            {type}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-brand-primary mb-3 leading-snug">{title}</h3>

        <div
          className="h-[3px] rounded-full mb-5"
          style={{
            background: accentColor,
            width: hovered ? "3.5rem" : "2rem",
            opacity: 0.5,
            transition: "width 0.4s ease",
          }}
        />

        <p className="text-brand-text-dark/70 text-sm leading-relaxed mb-6 flex-grow">{body}</p>

        <ul className="space-y-3">
          {points.map((pt, i) => (
            <li
              key={pt}
              className="flex items-center gap-3"
              style={{
                opacity: hovered ? 1 : 0.8,
                transform: hovered ? `translateX(${i * 2}px)` : "translateX(0)",
                transition: `opacity 0.3s ease ${i * 60}ms, transform 0.3s ease ${i * 60}ms`,
              }}
            >
              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
              <span className="text-sm text-brand-text-dark font-medium">{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function MissionVision() {
  const [headerRef, headerVisible] = useInView(0.2);
  const [cardsRef, cardsVisible] = useInView(0.1);

  return (
    <section className="relative overflow-hidden bg-transparent py-16 sm:py-24 px-4 sm:px-6">
      <div className="absolute top-[-80px] left-[-60px] w-80 h-80 rounded-full bg-white opacity-60 blur-[70px] pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-40px] w-72 h-72 rounded-full bg-brand-accent opacity-20 blur-[60px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div ref={headerRef} className="flex flex-col items-center text-center mb-12">
          <div
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}


          >
            <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full bg-white text-brand-primary mb-4">
              Our Foundation
            </span>
          </div>

          <h2
            className="text-4xl sm:text-5xl font-black text-brand-primary leading-tight tracking-tight mb-4"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease 100ms, transform 0.6s ease 100ms",
            }}
          >
            Mission &amp;{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-brand-accent">Vision</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 10" fill="none"
                style={{
                  opacity: headerVisible ? 1 : 0,
                  strokeDasharray: 220,
                  strokeDashoffset: headerVisible ? 0 : 220,
                  transition: "stroke-dashoffset 1s ease 600ms, opacity 0.4s ease 600ms",
                }}
              >
                <path d="M2 8 C40 2, 80 9, 120 4 C160 -1, 180 8, 198 5"
                  stroke="#59B292" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.75" />
              </svg>
            </span>
          </h2>

          <p
            className="max-w-lg text-brand-text-dark/70 text-sm sm:text-base leading-relaxed"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.6s ease 200ms, transform 0.6s ease 200ms",
            }}
          >
            Guided by purpose, driven by excellence — the compass that directs every decision at Neelgiri Public School, Hatwas.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            type="Mission" icon={Target}
            accentColor="#59B292"
            iconBg="bg-brand-bg-light" iconColor="text-brand-primary"
            tagBg="bg-brand-bg-light" tagText="text-brand-primary"
            title="What We Do Every Day"
            body="To provide a nurturing environment from Nursery to Class 12, empowering students with academic excellence, strong moral values, and life skills to make them responsible citizens."
            points={missionPoints}
            visible={cardsVisible} delay={0}
          />
          <Card
            type="Vision" icon={Eye}
            accentColor="#FA6781"
            iconBg="bg-brand-bg-light" iconColor="text-brand-primary"
            tagBg="bg-brand-bg-light" tagText="text-brand-primary"
            title="Where We Are Headed"
            body="To be a leading educational institution in the region that shapes students into confident, compassionate, and self-reliant individuals ready to excel in board examinations and future careers."
            points={visionPoints}
            visible={cardsVisible} delay={150}
          />
        </div>
      </div>
    </section>
  );
}
