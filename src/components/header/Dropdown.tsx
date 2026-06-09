import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ACCENT, DropdownItem } from "./navData";

interface DropdownProps {
  items: DropdownItem[];
  closeDD: () => void;
  setActiveNav: (label: string) => void;
  parentLabel: string;
}

export default function Dropdown({ items, closeDD, setActiveNav, parentLabel }: DropdownProps) {
  return (
    <div
      className="hdr-drop absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl bg-white border border-gray-100 shadow-xl overflow-hidden z-50"
      style={{ boxShadow: "0 16px 48px rgba(0,0,0,.12)" }}
    >
      <div className="p-2">
        {items.map((item, i) => {
          const Icon = item.icon;

          return (
            <Link
              key={i}
              href={item.to || "#"}
              className="drop-item flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline cursor-pointer"
              onClick={() => {
                closeDD();
                setActiveNav(parentLabel);
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${ACCENT}12` }}
              >
                <Icon size={16} style={{ color: ACCENT }} />
              </div>

              <div>
                <p className="text-[13px] font-semibold text-gray-800">
                  {item.label}
                </p>
                <p className="text-[11px] text-gray-400">
                  {item.sub}
                </p>
              </div>

              <ArrowUpRight size={13} className="ml-auto text-gray-300" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}