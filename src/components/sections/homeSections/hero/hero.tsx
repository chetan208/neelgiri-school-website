'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import "./heroAnimations.css";
import { slides } from "./heroData";
import HeroSlide from "./HeroSlide";
import HeroStatsBar from "./HeroStatsBar";
import HeroControls from "./HeroControls";
import HeroDots from "./HeroDots";
import HeroThumbnails from "./HeroThumbnails";
import HeroContent from "./HeroContent";

const DELAY = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState("next");
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const goTo = useCallback(
    (idx: number, d = "next") => {
      if (animating || idx === current) return;
      setDir(d);
      setPrev(current);
      setAnimating(true);
      setCurrent(idx);
      setProgress(0);

      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 650);
    },
    [animating, current]
  );

  const next = useCallback(
    () => goTo((current + 1) % slides.length, "next"),
    [current, goTo]
  );

  const goPrev = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length, "prev"),
    [current, goTo]
  );

  useEffect(() => {
    if (paused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startRef.current = performance.now();

    const tick = (now: number) => {
      if (!startRef.current) return;
      const p = Math.min((now - startRef.current) / DELAY, 1);
      setProgress(p);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        next();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [current, paused, next]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-[calc(100vh-90px)] overflow-hidden bg-black">
      {slides.map((sl, i) => {
        const isActive = i === current;
        const isPrev = i === prev;

        if (!isActive && !isPrev) return null;

        return (
          <HeroSlide
            key={sl.id}
            slide={sl}
            isActive={isActive}
            isPrev={isPrev}
            animating={animating}
            dir={dir}
          />
        );
      })}

      <div className="relative z-10 h-full max-w-[1280px] mx-auto px-5 flex items-center pt-16 pb-[130px] sm:pb-[140px] md:pb-[120px]">
        <HeroContent slide={slide} />
      </div>

      <HeroControls next={next} prev={goPrev} setPaused={setPaused} />
      
      <HeroDots
        slides={slides}
        current={current}
        progress={progress}
        goTo={goTo}
        slide={slide}
        setPaused={setPaused}
      />

      <HeroThumbnails
        slides={slides}
        current={current}
        goTo={goTo}
        progress={progress}
        setPaused={setPaused}
      />

      <div className="absolute bottom-4 left-0 right-0 z-20">
        <HeroStatsBar />
      </div>
    </section>
  );
}