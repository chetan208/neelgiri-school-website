import { GraduationCap, TrendingUp, Users, Award, Shield, Star, Lightbulb, Heart, Globe, BookOpen, FlaskConical, Rocket } from "lucide-react";

export const stats = [
  { icon: GraduationCap, value: "3.7 ⭐",     label: "Customer Rating"    },
  { icon: TrendingUp,    value: "100%",      label: "Academic Focus"     },
  { icon: Users,         value: "Experienced", label: "Dedicated Educators" },
  { icon: Award,         value: "Prestigious", label: "Educational Excellence"},
];

export const coreValues = [
  { icon: Shield,    label: "Inclusivity" },
  { icon: Star,      label: "Excellence"  },
  { icon: Lightbulb, label: "Structured"  },
  { icon: Heart,     label: "Supportive"  },
  { icon: Globe,     label: "Diverse"     },
];

export interface TimelineItem {
  year: string;
  icon: React.ComponentType<any>;
  color: "violet" | "purple" | "indigo" | "fuchsia" | "teal";
  title: string;
  tag: string;
  desc: string;
}

export const timeline: TimelineItem[] = [
  {
    year: "Establishment",
    icon: BookOpen,
    color: "violet",
    title: "A Prestigious Beginning",
    tag: "Foundation",
    desc: "Neelgiri Public High School was established in Hatwas, Kangra with a vision to provide a high-quality educational environment that caters to diverse student needs.",
  },
  {
    year: "Growth",
    icon: Award,
    color: "purple",
    title: "Academic Milestone",
    tag: "Excellence",
    desc: 'The school built its reputation on a well-rounded curriculum that includes not just core academic subjects, but also arts and physical education.',
  },
  {
    year: "Expansion",
    icon: Globe,
    color: "indigo",
    title: "Diverse Learning Levels",
    tag: "Inclusivity",
    desc: "Expanded schooling levels to cater from early childhood through higher education, ensuring every student receives individual attention.",
  },
  {
    year: "Modernization",
    icon: FlaskConical,
    color: "fuchsia",
    title: "State-of-the-Art Facilities",
    tag: "Innovation",
    desc: "The campus was upgraded with modern facilities designed to support both academic rigor and extracurricular engagement.",
  },
  {
    year: "Today",
    icon: Rocket,
    color: "teal",
    title: "Join Our Legacy",
    tag: "Admissions Open",
    desc: "With a strong focus on structured governance and transparency, we continue to welcome applications from students of all backgrounds. Admissions are now open.",
  },
];

export const colorMap: Record<string, { dot: string; icon: string; tag: string; border: string }> = {
  violet: { dot: "bg-violet-500 ring-violet-200", icon: "bg-violet-100 text-violet-600", tag: "bg-violet-100 text-violet-700", border: "border-violet-200 hover:border-violet-400" },
  purple: { dot: "bg-purple-500 ring-purple-200", icon: "bg-purple-100 text-purple-600", tag: "bg-purple-100 text-purple-700", border: "border-purple-200 hover:border-purple-400" },
  indigo: { dot: "bg-indigo-500 ring-indigo-200", icon: "bg-indigo-100 text-indigo-600", tag: "bg-indigo-100 text-indigo-700", border: "border-indigo-200 hover:border-indigo-400" },
  fuchsia: { dot: "bg-fuchsia-500 ring-fuchsia-200", icon: "bg-fuchsia-100 text-fuchsia-600", tag: "bg-fuchsia-100 text-fuchsia-700", border: "border-fuchsia-200 hover:border-fuchsia-400" },
  teal: { dot: "bg-teal-500 ring-teal-200", icon: "bg-teal-100 text-teal-600", tag: "bg-teal-100 text-teal-700", border: "border-teal-200 hover:border-teal-400" },
};