import { SlideType } from "./heroData";

interface SlideProps {
  slide: SlideType;
  isActive: boolean;
  isPrev: boolean;
  animating: boolean;
  dir: string;
}

export default function HeroSlide({ slide, isActive, isPrev, animating, dir }: SlideProps) {
  let cls = "";

  if (isActive && animating) {
    cls = dir === "next" ? "pp-slide-in-right" : "pp-slide-in-left";
  } else if (isPrev && animating) {
    cls = dir === "next" ? "pp-slide-out-left" : "pp-slide-out-right";
  }

  return (
    <div className={`absolute inset-0 ${cls}`} style={{ zIndex: isActive ? 2 : 1 }}>
      <div
        className={`absolute inset-0 bg-cover bg-center ${isActive && !animating ? "pp-kenburns" : ""}`}
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(105deg,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.5) 45%,rgba(0,0,0,0.15) 75%,rgba(0,0,0,0.05) 100%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 40%)" }}
      />
    </div>
  );
}