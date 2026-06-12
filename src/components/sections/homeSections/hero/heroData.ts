import { GraduationCap, TrendingUp, Users, Trophy } from "lucide-react";

export interface SlideType {
  id: number;
  image: string;
  tag: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  cta: string;
  ctaTo: string;
  ctaSecondary: string;
  ctaSecondaryTo?: string;
  from: string;
  to: string;
}

export const slides: SlideType[] = [
  {
    id: 1,
    image: "/assets/home/hero_slide1.png", // public folder reference
    tag: "Welcome to Neelgiri Public School",
    title: "Bright Futures",
    titleAccent: "at Hatwas, Nagrota ",
    subtitle: "A prestigious institution providing a comprehensive education so every student can excel.",
    cta: "Explore Programs",
    ctaTo: "#our-courses",
    ctaSecondary: "Take a Tour",
    ctaSecondaryTo: "/campus-tour",
    from: "#FFC94D",
    to: "#FA6781",
  },
  {
    id: 2,
    image: "/assets/home/hero_slide2.png",
    tag: "Excellence In Education",
    title: "A Structured Path",
    titleAccent: "to Success",
    subtitle: "Join a diverse community where transparent selection and academic excellence prepare students for the challenges of tomorrow.",
    cta: "Apply Now",
    ctaTo: "/admissions",
    ctaSecondary: "Academic Calendar",
    ctaSecondaryTo: "/academic-calendar",
    from: "#FFC94D",
    to: "#59B292",
  },
  {
    id: 3,
    image: "/assets/home/hero_slide3.png",
    tag: "Holistic Environment",
    title: "Learn, Grow &",
    titleAccent: "Succeed Daily",
    subtitle: "Equipped with state-of-the-art facilities, we blend academic rigour with arts and physical education for a well-rounded experience.",
    cta: "About Us",
    ctaTo: "/about/our-story",
    ctaSecondary: "View Gallery",
    ctaSecondaryTo: "/gallery",
    from: "#59B292",
    to: "#FA6781",
  },
];