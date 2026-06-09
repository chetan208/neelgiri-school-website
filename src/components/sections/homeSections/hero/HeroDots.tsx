import { SlideType } from "./heroData";

interface DotsProps {
  slides: SlideType[];
  current: number;
  progress: number;
  goTo: (idx: number, d?: string) => void;
  slide: SlideType;
  setPaused: (paused: boolean) => void;
}

export default function HeroDots({ slides, current, progress, goTo, setPaused }: DotsProps) {
  return (
    <div
      className="absolute bottom-[120px] left-5 z-20 flex items-center gap-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((sl, i) => (
        <button key={i} onClick={() => goTo(i, i > current ? "next" : "prev")}>
          {i === current ? (
            <div className="w-9 h-[6px] rounded-full overflow-hidden bg-white/20">
              <div
                className="h-full rounded-full"
                style={{ width: `${progress * 100}%`, background: "white" }}
              />
            </div>
          ) : (
            <div className="w-[6px] h-[6px] rounded-full bg-white/40" />
          )}
        </button>
      ))}
    </div>
  );
}