import React from "react";

interface ClassSelectionProps {
  onSelectClass: (cls: string) => void;
}

export default function ClassSelection({ onSelectClass }: ClassSelectionProps) {
  const classesAvailable = ["12", "11", "10", "9", "8", "7", "6"];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {classesAvailable.map((cls) => (
          <button
            key={cls}
            onClick={() => onSelectClass(cls)}
            className="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-slate-100/50 rounded-xl text-center font-bold text-slate-700 transition-all cursor-pointer text-sm"
          >
            Class {cls}
          </button>
        ))}
      </div>
    </div>
  );
}