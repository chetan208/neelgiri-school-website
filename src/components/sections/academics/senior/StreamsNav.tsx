'use client';

import React from "react";
import { motion } from "framer-motion";

interface StreamsNavProps {
  active: string;
  setActive: (id: string) => void;
}

export default function StreamsNav({ active, setActive }: StreamsNavProps) {
  const tabs = [
    { id: "medical", label: "Medical" },
    { id: "non-medical", label: "Non-Medical" },
  ];

  const activeIndex = tabs.findIndex((t) => t.id === active);

  return (
    <div className="flex justify-center px-4">
      <div className="relative flex bg-white border border-[#093C5D]/20 rounded-full p-1.5 gap-1 shadow-sm w-full max-w-xs sm:max-w-md lg:max-w-lg">
        {/* SLIDING INDICATOR */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-1.5 bottom-1.5 rounded-full bg-[#FA6781] shadow-xs"
          style={{
            width: `calc(${100 / tabs.length}% - 4px)`,
            left: `calc(${activeIndex * (100 / tabs.length)}% + 2px)`,
          }}
        />

        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="relative z-10 flex-1 px-4 py-2.5 sm:px-8 sm:py-3 rounded-full font-semibold text-[13px] sm:text-base transition-colors duration-200 whitespace-nowrap cursor-pointer border-0 bg-transparent"
              style={{ color: isActive ? "#ffffff" : "#06283D" }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}