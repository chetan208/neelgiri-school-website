import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Dropdown from './Dropdown';
import { NavItem } from './navData';

interface DesktopNavProps {
  navItems: NavItem[];
  activeNav: string;
  setActiveNav: (label: string) => void;
  navigate: (path: string) => void;
  activeDD: string | null;
  openDD: (label: string) => void;
  closeDD: () => void;
}

export default function DesktopNav({ navItems, activeNav, setActiveNav, navigate, activeDD, openDD, closeDD }: DesktopNavProps) {
  return (
    <nav className="hidden lg:flex items-center gap-1 ml-10 flex-1">
      {navItems.map((item) => {
        const hasDD = !!item.dropdown;

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => hasDD && openDD(item.label)}
            onMouseLeave={() => hasDD && closeDD()}
          >
            {item.to && !hasDD ? (
              <Link
                href={item.to}
                className={`cursor-pointer nav-link flex items-center gap-1 px-4 py-2.5 rounded-xl text-[13.5px] font-bold transition-all duration-200 hover:bg-[#093C5D]/8 hover:text-[#093C5D] ${
                  activeNav === item.label
                    ? "active text-[#093C5D]"
                    : "text-[#06283D]"
                }`}
                onClick={() => setActiveNav(item.label)}
              >
                {item.label}
              </Link>
            ) : (
              <button
                className={`cursor-pointer nav-link flex items-center gap-1 px-4 py-2.5 rounded-xl text-[13.5px] font-bold transition-all duration-200 hover:bg-[#093C5D]/8 hover:text-[#093C5D] ${
                  activeNav === item.label
                    ? "active text-[#093C5D]"
                    : "text-[#06283D]"
                }`}
                onClick={() => {
                  setActiveNav(item.label);
                  if (item.to) navigate(item.to);
                }}
              >
                {item.label}
                {hasDD && (
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-300 ${activeDD === item.label ? "rotate-180" : ""}`}
                  />
                )}
              </button>
            )}

            {hasDD && activeDD === item.label && item.dropdown && (
              <Dropdown
                items={item.dropdown}
                closeDD={closeDD}
                setActiveNav={setActiveNav}
                parentLabel={item.label}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}