import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { SlideType } from "./heroData";

export default function HeroContent({ slide }: { slide: SlideType }) {
  const router = useRouter();
  return (
    <div className="max-w-[92%] sm:max-w-[700px]">
      <span
        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 rounded-full text-[9px] sm:text-[10px] font-bold tracking-[0.08em] uppercase text-white border border-white/20 mb-4 sm:mb-5"
        style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
      >
        <span className="w-[6px] h-[6px] rounded-full" style={{ background: slide.from }} />
        {slide.tag}
      </span>

      <h1 className="text-white font-black leading-[1] tracking-[-0.02em] mb-5 sm:mb-6 text-[2rem] min-[400px]:text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] break-words hyphens-auto">
        <span className="block">{slide.title}</span>
        <span
          className="inline-block mt-1"
          style={{
            color: slide.to,
          }}
        >
          {slide.titleAccent}
        </span>
      </h1>

      <div className="w-12 sm:w-16 h-[3px] sm:h-[4px] rounded-full mb-5 sm:mb-7" style={{ background: slide.to }} />

      <p className="text-white/80 leading-[1.6] max-w-[500px] mb-7 sm:mb-8 text-[13px] sm:text-[14px] md:text-[15px]">
        {slide.subtitle}
      </p>

      <div className="flex flex-wrap gap-3 sm:gap-4">
        <button
          className="px-5 py-2.5 sm:px-7 sm:py-3 rounded-full text-[#06283D] font-bold text-[13px] sm:text-[14px] transition-all duration-300 hover:scale-[1.03]"
          style={{
            background: slide.to,
            boxShadow: `2px 2px 0px #000`,
          }}
          onClick={() => {
            if (slide.ctaTo.startsWith("#")) {
              const el = document.getElementById(slide.ctaTo.substring(1));
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            } else {
              router.push(slide.ctaTo);
            }
          }}
        >
          {slide.cta}
        </button>
        <button
          className="flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full text-white font-semibold text-[13px] sm:text-[14px] border border-white/20 transition-all duration-300 hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
          onClick={() => router.push(slide.ctaSecondaryTo || "#")}
        >
          {slide.ctaSecondary}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}