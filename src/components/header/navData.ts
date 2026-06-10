import {
  BookOpen,
  Users,
  MapPin,
  GraduationCap,
  BookMarked,
  FlaskConical,
  FileText,
  ClipboardList,
  Newspaper,
  Award,
} from "lucide-react";

export const ACCENT = "#093C5D";
export const ACCENT2 = "#FFC94D";

export interface DropdownItem {
  icon: React.ComponentType<any>;
  label: string;
  sub: string;
  to: string;
}

export interface NavItem {
  label: string;
  to?: string;
  href?: string;
  dropdown?: DropdownItem[];
}

export const navItems: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About",
    href: "#",
    dropdown: [
      { icon: BookOpen, label: "Our Story", sub: "30 years of excellence", to: "/about/our-story" },
      { icon: Users, label: "Leadership Team", sub: "Meet our principal & staff", to: "/about/leadership" },
      { icon: MapPin, label: "Campus Tour", sub: "Explore our campus", to: "/campus-tour" },
    ],
  },
  {
    label: "Academics",
    dropdown: [
      { icon: GraduationCap, label: "Primary (1–5)", sub: "Foundation years", to: "/academics/primary-years" },
      { icon: BookMarked, label: "High School (6–10)", sub: "Core curriculum", to: "/academics/high-school" },
      { icon: FlaskConical, label: "Senior Secondary (11–12)", sub: "Science · Commerce · Arts", to: "/academics/secondary-years" },
    ],
  },
  {
    label: "Resources",
    href: "#",
    dropdown: [
      { icon: FileText, label: "Academic Calendar", sub: "Term dates & holidays", to: "#" },
      { icon: ClipboardList, label: "Previous Question Papers", sub: "Download past papers", to: "/prevous-years-papers" },
      { icon: Newspaper, label: "School News", sub: "Latest announcements", to: "#" },
      { icon: Award, label: "Achievements", sub: "Student accomplishments", to: "#" },
    ],
  },
  { label: "Gallery", to: "/gallery" },
  { label: "Admissions", to: "/admissions" },
  { label: "Notifications", to: "/all-notices" },
  { label: "Transport", to: "/transport" },
  { label: "Contact", to: "/contact" },
];
