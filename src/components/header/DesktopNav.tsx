import React from 'react';
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
            <button
              className={`cursor-pointer nav-link flex items-center gap-1 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 ${
                activeNav === item.label
                  ? "text-teal-700 bg-teal-50"
                  : "text-gray-600 hover:bg-slate-100 hover:text-gray-900"
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