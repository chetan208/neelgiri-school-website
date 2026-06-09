import { ChevronLeft, ChevronRight } from "lucide-react";

interface ControlsProps {
  next: () => void;
  prev: () => void;
  setPaused: (paused: boolean) => void;
}

export default function HeroControls({ next, prev, setPaused }: ControlsProps) {
  return (
    <>
      <button
        onClick={prev}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/25 text-white items-center justify-center bg-white/10 backdrop-blur-md"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={next}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/25 text-white items-center justify-center bg-white/10 backdrop-blur-md"
      >
        <ChevronRight size={18} />
      </button>
    </>
  );
}