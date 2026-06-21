import {
  GraduationCap,
  Users,
  ClipboardList,
  BookOpen,
  CalendarDays,
  CreditCard,
  Bus,
  BarChart3,
  Award,
  Settings,
  Inbox,
  LucideIcon
} from "lucide-react";

export interface ModuleType {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  description: string;
  status: "active" | "coming-soon";
}

export const modules: ModuleType[] = [
  {
    id: "students",
    label: "Student Management",
    icon: GraduationCap,
    color: "#093C5D",
    bg: "rgba(9,60,93,0.08)",
    description: "Enroll, track attendance, and manage student records.",
    status: "active",
  },
  {
    id: "fees",
    label: "Fee Management",
    icon: CreditCard,
    color: "#14B8A6",
    bg: "rgba(20,184,166,0.10)",
    description: "Fee collection, receipts, dues, and reports.",
    status: "active",
  },
  {
    id: "transport",
    label: "Transport",
    icon: Bus,
    color: "#093C5D",
    bg: "rgba(9,60,93,0.08)",
    description: "Station fee rates, route management, and student bus allocation.",
    status: "active",
  },
   {
    id: "staff",
    label: "Staff & HR",
    icon: Users,
    color: "#59B292",
    bg: "rgba(89,178,146,0.10)",
    description: "Employee profiles, payroll, leaves, and scheduling.",
    status: "active",
  },
  {
    id: "admissions",
    label: "Admissions",
    icon: Inbox,
    color: "#FA6781",
    bg: "rgba(250,103,129,0.10)",
    description: "Manage online registration applications, open/close admission years, and approve candidates.",
    status: "active",
  },
 
  
  
  // {
  //   id: "exams",
  //   label: "Examinations",
  //   icon: ClipboardList,
  //   color: "#FA6781",
  //   bg: "rgba(250,103,129,0.10)",
  //   description: "Timetables, mark sheets, and result publication.",
  //   status: "coming-soon",
  // },
  // {
  //   id: "library",
  //   label: "Library",
  //   icon: BookOpen,
  //   color: "#FFC94D",
  //   bg: "rgba(255,201,77,0.10)",
  //   description: "Book inventory, issue & return management.",
  //   status: "coming-soon",
  // },
  // {
  //   id: "timetable",
  //   label: "Timetable",
  //   icon: CalendarDays,
  //   color: "#6C63FF",
  //   bg: "rgba(108,99,255,0.10)",
  //   description: "Class schedules, teacher assignments, and periods.",
  //   status: "coming-soon",
  // },
  // {
  //   id: "reports",
  //   label: "Reports & Analytics",
  //   icon: BarChart3,
  //   color: "#8B5CF6",
  //   bg: "rgba(139,92,246,0.10)",
  //   description: "Academic, financial, and attendance analytics.",
  //   status: "coming-soon",
  // },
  // {
  //   id: "certificates",
  //   label: "Certificates",
  //   icon: Award,
  //   color: "#EC4899",
  //   bg: "rgba(236,72,153,0.10)",
  //   description: "Generate TC, bonafide, and achievement certificates.",
  //   status: "coming-soon",
  // },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    color: "#64748B",
    bg: "rgba(100,116,139,0.10)",
    description: "School info, session, academic year, and configurations.",
    status: "active",
  },
];

export const summaryStats = [
  { label: "Total Students",  value: "—",   color: "#093C5D", icon: GraduationCap },
  { label: "Teaching Staff",  value: "—",   color: "#59B292", icon: Users },
  { label: "Pending Fees",    value: "—",   color: "#FA6781", icon: CreditCard },
];
