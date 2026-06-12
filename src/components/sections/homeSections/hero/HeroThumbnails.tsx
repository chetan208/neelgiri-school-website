import { SlideType } from "./heroData";

interface ThumbnailsProps {
  slides: SlideType[];
  current: number;
  goTo: (idx: number, d?: string) => void;
  progress: number;
  setPaused: (paused: boolean) => void;
}

export default function HeroThumbnails({ slides, current, goTo, progress, setPaused }: ThumbnailsProps) {
  return (
    <div
      className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((sl, i) => (
        <button
          key={i}
          onClick={() => goTo(i, i > current ? "next" : "prev")}
          className="relative w-20 h-14 rounded-xl overflow-hidden"
          style={{ opacity: i === current ? 1 : 0.5 }}
        >
          <img src={sl.image} alt={`Thumbnail: ${sl.title} ${sl.titleAccent}`} className="w-full h-full object-cover" />
          {i === current && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/20">
              <div
                className="h-full"
                style={{ width: `${progress * 100}%`, background: sl.to }}
              />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}