import {
  Smile, BookOpen, FlaskConical, Music, Palette,
  Globe, Calculator, Microscope, Code2, BookMarked,
  Trophy, Users, Clock, GraduationCap
} from "lucide-react";

export interface SubjectItem {
  icon: React.ComponentType<any>;
  label: string;
}

export interface StatItem {
  icon: React.ComponentType<any>;
  value: string;
  label: string;
}

export interface LevelItem {
  id: string;
  label: string;
  short: string;
  range: string;
  icon: React.ComponentType<any>;
  color: string;
  tagBg: string;
  tagText: string;
  image: string;
  headline: string;
  desc: string;
  subjects: SubjectItem[];
  stats: StatItem[];
  age: string;
  path: string;
}

export const levels: LevelItem[] = [
  {
    id: "primary",
    label: "Primary",
    short: "1–5",
    range: "Grade 1 – 5",
    icon: Smile,
    color: "#093C5D",
    tagBg: "#FFC94D",
    tagText: "#093C5D",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80&fit=crop",
    headline: "Building Bright Beginnings",
    desc: "A nurturing foundation that sparks curiosity and a love for learning through play-based discovery.",
    subjects: [
      { icon: BookOpen,   label: "English" },
      { icon: Calculator, label: "Maths" },
      { icon: Globe,      label: "EVS" },
      { icon: Palette,    label: "Art & Craft" },
      { icon: Music,      label: "Music" },
    ],
    stats: [
      { icon: Users,  value: "4,200+", label: "Students" },
      { icon: Clock,  value: "6 hrs",  label: "Daily" },
      { icon: Trophy, value: "#1",     label: "Ranked" },
    ],
    age: "Ages 6 – 11",
    path: "/academics/primary-years",
  },
  {
    id: "high",
    label: "High School",
    short: "6–10",
    range: "Grade 6 – 10",
    icon: BookMarked,
    color: "#59B292",
    tagBg: "rgba(89, 178, 146, 0.15)",
    tagText: "#3b8b70",
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=900&q=80&fit=crop",
    headline: "Expanding Horizons",
    desc: "Rigorous yet engaging curriculum sharpening analytical thinking and scientific reasoning.",
    subjects: [
      { icon: Microscope,  label: "Science" },
      { icon: Calculator,  label: "Mathematics" },
      { icon: Globe,       label: "Social Studies" },
      { icon: BookOpen,    label: "Literature" },
      { icon: Palette,     label: "Fine Arts" },
    ],
    stats: [
      { icon: Users,  value: "5,800+", label: "Students" },
      { icon: Clock,  value: "7 hrs",  label: "Daily" },
      { icon: Trophy, value: "98%",    label: "Pass Rate" },
    ],
    age: "Ages 11 – 16",
    path: "/academics/high-school",
  },
  {
    id: "senior",
    label: "Senior Secondary",
    short: "11–12",
    range: "Grade 11 – 12",
    icon: GraduationCap,
    color: "#FA6781",
    tagBg: "rgba(250, 103, 129, 0.15)",
    tagText: "#FA6781",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=80&fit=crop",
    headline: "Crafting Future Leaders",
    desc: "Specialized Medical & Non-Medical streams with exam-ready depth for medical, engineering, and tech careers.",
    subjects: [
      { icon: FlaskConical, label: "Physics & Chem" },
      { icon: Microscope,   label: "Biology" },
      { icon: Calculator,   label: "Mathematics" },
      { icon: Code2,        label: "Computer Sci" },
      { icon: BookOpen,     label: "English" },
    ],
    stats: [
      { icon: Users,  value: "2,000+", label: "Students" },
      { icon: Clock,  value: "8 hrs",  label: "Daily" },
      { icon: Trophy, value: "Top 5%", label: "Board" },
    ],
    age: "Ages 16 – 18",
    path: "/academics/secondary-years",
  },
];