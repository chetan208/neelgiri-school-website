"use client";

import { LayoutGrid, Image, Video, Layers } from "lucide-react";

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  selectedType: string;
  onCategoryChange: (c: string) => void;
  onTypeChange: (t: string) => void;
}

export default function FilterBar({ categories, selectedCategory, selectedType, onCategoryChange, onTypeChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full">
      
      {/* ─── 1. Type Filter (All, Photos, Videos) ─── */}
      {/* max-w-full aur overflow-x-auto lagaya hai taaki agar bohot choti screen ho toh ye section bhi na tute */}
      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/80 rounded-xl p-1.5 w-full sm:w-max overflow-x-auto no-scrollbar shadow-sm shrink-0">
        {[
          { id: "all", label: "All Media", icon: LayoutGrid },
          { id: "image", label: "Photos", icon: Image },
          { id: "video", label: "Videos", icon: Video }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = selectedType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTypeChange(t.id)}
              className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap active:scale-95 flex-1 sm:flex-initial ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm shadow-slate-900/10"
                  : "text-gray-600 hover:text-slate-900 hover:bg-gray-100"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-gray-400"}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ─── 2. Category Filter (Scrollable on Mobile, Wrapped on Desktop) ─── */}
      {/* no-scrollbar tailwind utility custom scrollbars ko mobile se hide kar degi */}
      <div className="w-full lg:w-auto overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 md:overflow-visible">
        <div className="flex gap-2 flex-nowrap sm:flex-wrap pb-1 sm:pb-0 min-w-max sm:min-w-0">
          
          {/* All Categories Button */}
          <button
            onClick={() => onCategoryChange("all")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 whitespace-nowrap active:scale-95 ${
              selectedCategory === "all"
                ? "border-slate-900 bg-slate-900 text-white shadow-sm shadow-slate-900/10"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Categories
          </button>

          {/* Dynamic Database Categories */}
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border transition-all duration-200 whitespace-nowrap active:scale-95 ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm shadow-slate-900/10"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-slate-900"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}