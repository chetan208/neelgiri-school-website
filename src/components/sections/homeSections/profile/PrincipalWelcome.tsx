'use client';

import { useState, useEffect, useRef } from "react";
import { Users, Quote } from "lucide-react";
import SectionLabel from "./SectionLabel";

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

export default function PrincipalWelcome() {
  const [cardRef, cardVisible] = useInView(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative bg-white rounded-2xl border border-brand-bg-light overflow-hidden"
        style={{
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.65s ease, transform 0.65s ease, box-shadow 0.3s ease",
          boxShadow: hovered
            ? "0 20px 48px -12px rgba(0,0,0,0.1), 0 4px 12px -2px rgba(0,0,0,0.06)"
            : "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-brand-accent opacity-20 blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-brand-bg-light opacity-80 blur-[50px] pointer-events-none" />

        <div className="relative z-10 grid md:grid-cols-[300px_1fr]">
          <div className="flex flex-col items-center justify-center p-7 bg-brand-bg-light border-b md:border-b-0 md:border-r border-white/70">
            <div
              className="relative w-52 aspect-[3/4] rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
              style={{
                transform: hovered ? "scale(1.02)" : "scale(1)",
                transition: "transform 0.5s ease",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <img
                src="/principal-portrait.png"
                alt="Principal"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div
              className="mt-5 px-4 py-1.5 bg-brand-primary text-white text-[11px] font-bold rounded-full text-center"
              style={{
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.5s ease 300ms, transform 0.5s ease 300ms",
              }}
            >
              Mohinder Singh
            </div>
            <p
              className="mt-1.5 text-[9px] text-brand-text-dark/60 tracking-wider uppercase font-bold"
              style={{ opacity: cardVisible ? 1 : 0, transition: "opacity 0.5s ease 400ms" }}
            >
              Principal
            </p>
          </div>

          <div className="p-7 sm:p-9 flex flex-col justify-center">
            <div
              style={{
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.55s ease 150ms, transform 0.55s ease 150ms",
              }}
            >
              <SectionLabel>A Word From Leadership</SectionLabel>
            </div>

            <h2
              className="text-2xl sm:text-3xl font-black text-brand-primary font-serif mt-1 mb-5 leading-tight"
              style={{
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.55s ease 220ms, transform 0.55s ease 220ms",
              }}
            >
              Principal's Welcome
            </h2>

            <blockquote
              className="relative pl-5 border-l-2 border-brand-accent mb-5"
              style={{
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? "translateX(0)" : "translateX(-12px)",
                transition: "opacity 0.6s ease 300ms, transform 0.6s ease 300ms",
              }}
            >
              <Quote className="absolute -top-1.5 -left-1 w-3 h-3 text-brand-accent -rotate-180" />
              <p className="text-sm sm:text-base text-brand-text-dark font-serif italic leading-relaxed">
                "Education is not the filling of a pail, but the lighting of a fire — and at Neelgiri Public School, we ignite that spark of curiosity and discipline in every student, every single day."
              </p>
            </blockquote>

            <div
              className="space-y-2 text-brand-text-dark/75 text-xs sm:text-[13px] leading-relaxed"
              style={{
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.55s ease 380ms, transform 0.55s ease 380ms",
              }}
            >
              <p>
                "Welcome to Neelgiri Public School, Hatwas. Our school is not just an academic institution, but a vibrant family where every child from Nursery to Class 12 is nurtured to discover their full potential. We firmly believe that with the right guidance, strong moral values, and a disciplined environment, every student can achieve excellence in life."
              </p>
              <p className="sm:block">
                "Our core focus lies in balancing top-tier academic results—especially in Higher Secondary board examinations—with holistic development. From a child's very first steps in our foundational classes to their final years preparing for future careers, we ensure they grow into confident, responsible, and self-reliant individuals."
              </p>

              <p>
                "I warmly invite prospective students and families to visit our campus and experience firsthand what makes our school community so special: our dedicated faculty, our rooted cultural values, and our unwavering commitment to shaping the leaders of tomorrow."
              </p>
            </div>

            <div
              className="mt-6 pt-5 border-t border-brand-bg-light flex items-center gap-3"
              style={{
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.55s ease 460ms, transform 0.55s ease 460ms",
              }}
            >
              <span
                className="block h-0.5 bg-brand-accent rounded-full transition-all duration-500"
                style={{ width: hovered ? "2.5rem" : "2rem" }}
              />
              <div>
                <p className="font-bold text-brand-primary font-serif text-sm leading-none">
                  Mohinder Singh
                </p>
                <p className="text-[9px] text-brand-text-dark/60 tracking-wider uppercase font-bold mt-1">
                  Principal — Neelgiri Public School
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
