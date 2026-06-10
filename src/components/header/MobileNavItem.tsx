import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ACCENT, NavItem } from "./navData";

interface MobileNavItemProps {
  item: NavItem;
  onClose: () => void;
}

export default function MobileNavItem({ item, onClose }: MobileNavItemProps) {
  const [open, setOpen] = useState(false);
  const hasDD = !!item.dropdown;
  const itemClasses = "w-full flex items-center justify-between px-5 py-3.5 text-left focus:bg-[#093C5D]/10 outline-none transition-colors";

  return (
    <div className="border-b border-[#093C5D]/10 last:border-0">
      {hasDD ? (
        <button className={itemClasses} onClick={() => setOpen(!open)}>
          <span className="text-[14px] font-semibold text-gray-700 tracking-wide">
            {item.label}
          </span>
          <ChevronDown
            size={16}
            className={`text-[#06283D]/60 transition-transform duration-300 ${open ? "rotate-180 text-[#093C5D]" : ""}`}
          />
        </button>
      ) : (
        <Link href={item.to || item.href || "#"} className={`${itemClasses} block`} onClick={onClose}>
          <span className="text-[14px] font-semibold text-gray-700 tracking-wide">
            {item.label}
          </span>
        </Link>
      )}

      {hasDD && item.dropdown && (
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: open ? "1000px" : "0px",
            opacity: open ? 1 : 0,
            visibility: open ? "visible" : "hidden",
          }}
        >
          <div className="px-4 pb-3 pt-1 flex flex-col gap-2">
            {item.dropdown.map((d, i) => {
              const Icon = d.icon;
              return (
                <Link
                  key={i}
                  href={d.to}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all active:scale-[0.99]"
                  style={{ background: `${ACCENT}06` }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${ACCENT}15` }}
                  >
                    <Icon size={14} style={{ color: ACCENT }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#093C5D] truncate">
                      {d.label}
                    </p>
                    {d.sub && (
                      <p className="text-[11px] text-[#06283D]/60 truncate mt-0.5">
                        {d.sub}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}