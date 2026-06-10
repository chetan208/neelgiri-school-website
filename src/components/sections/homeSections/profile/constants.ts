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
  color: "accent" | "primary";
  title: string;
  tag: string;
  desc: string;
}

export const timeline: TimelineItem[] = [
  {
    year: "Establishment",
    icon: BookOpen,
    color: "accent",
    title: "A Prestigious Beginning",
    tag: "Foundation",
    desc: "Neelgiri Public High School was established in Hatwas, Kangra with a vision to provide a high-quality educational environment that caters to diverse student needs.",
  },
  {
    year: "Growth",
    icon: Award,
    color: "primary",
    title: "Academic Milestone",
    tag: "Excellence",
    desc: 'The school built its reputation on a well-rounded curriculum that includes not just core academic subjects, but also arts and physical education.',
  },
  {
    year: "Expansion",
    icon: Globe,
    color: "accent",
    title: "Diverse Learning Levels",
    tag: "Inclusivity",
    desc: "Expanded schooling levels to cater from early childhood through higher education, ensuring every student receives individual attention.",
  },
  {
    year: "Modernization",
    icon: FlaskConical,
    color: "primary",
    title: "State-of-the-Art Facilities",
    tag: "Innovation",
    desc: "The campus was upgraded with modern facilities designed to support both academic rigor and extracurricular engagement.",
  },
  {
    year: "Today",
    icon: Rocket,
    color: "accent",
    title: "Join Our Legacy",
    tag: "Admissions Open",
    desc: "With a strong focus on structured governance and transparency, we continue to welcome applications from students of all backgrounds. Admissions are now open.",
  },
];

export const colorMap: Record<string, { dot: string; icon: string; tag: string; border: string }> = {
  accent: { dot: "bg-brand-accent ring-white", icon: "bg-brand-accent text-brand-primary", tag: "bg-brand-accent text-brand-primary", border: "border-brand-accent/30 hover:border-brand-accent" },
  primary: { dot: "bg-brand-primary ring-white", icon: "bg-brand-teal text-white", tag: "bg-brand-teal text-white", border: "border-brand-teal/30 hover:border-brand-primary" },
};
