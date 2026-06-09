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
    image: "/assets/image1.png", // public folder reference
    tag: "Welcome to Neelgiri Public School",
    title: "Bright Futures",
    titleAccent: "at Hatwas, Nagrota ",
    subtitle: "A prestigious institution providing a comprehensive education so every student can excel.",
    cta: "Explore Programs",
    ctaTo: "/academics",
    ctaSecondary: "Take a Tour",
    from: "#0d9488",
    to: "#06b6d4",
  },
  {
    id: 2,
    image: "/assets/image2.png",
    tag: "Excellence In Education",
    title: "A Structured Path",
    titleAccent: "to Success",
    subtitle: "Join a diverse community where transparent selection and academic excellence prepare students for the challenges of tomorrow.",
    cta: "Apply Now",
    ctaTo: "/admissions",
    ctaSecondary: "Admissions Info",
    ctaSecondaryTo: "/admissions",
    from: "#7c3aed",
    to: "#a855f7",
  },
  {
    id: 3,
    image: "/assets/image3.png",
    tag: "Holistic Environment",
    title: "Learn, Grow &",
    titleAccent: "Succeed Daily",
    subtitle: "Equipped with state-of-the-art facilities, we blend academic rigour with arts and physical education for a well-rounded experience.",
    cta: "Our Facilities",
    ctaTo: "/about/leadership",
    ctaSecondary: "View Gallery",
    ctaSecondaryTo: "/gallery",
    from: "#d97706",
    to: "#f59e0b",
  },
];