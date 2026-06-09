import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, User, ShieldCheck, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ACCENT, ACCENT2 } from './navData';

interface RightActionButtonsProps {
  setMobileOpen: (open: boolean) => void;
}

export default function RightActionButtons({ setMobileOpen }: RightActionButtonsProps) {
  const { user, authLoading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isAdminOrSuperAdmin = user && (user.role === "Admin" || user.role === "Owner");
  const isCurrentlyOnAdminPage = pathname.startsWith('/admin');

  if (authLoading) {
    return (
      <div className="hidden lg:flex items-center justify-center w-10 h-10">
        <Loader2 size={18} className="animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 ml-auto lg:ml-0 relative">
      {user ? (
        <div className="hidden lg:flex items-center gap-3">
          {isAdminOrSuperAdmin && !isCurrentlyOnAdminPage && (
            <Link href="/admin" className="px-4 py-2 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100/80 hover:bg-teal-100 transition-all shadow-sm flex items-center gap-1">
              <ShieldCheck size={14} /> Admin Panel
            </Link>
          )}

          <div className="relative py-2" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <button onClick={() => router.push("/me")} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all text-left outline-none cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-sm text-white uppercase shadow-sm overflow-hidden shrink-0">
                {user.imageUrl ? <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" /> : user.name?.charAt(0)}
              </div>
              <div className="max-w-[80px] hidden xl:block">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{user.role}</p>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-50">
                <button onClick={() => { setDropdownOpen(false); router.push("/me"); }} className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                  <User size={14} className="text-slate-400" /> My Profile
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button onClick={async () => { setDropdownOpen(false); await logout(); router.push("/auth"); }} className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Link href="/auth" className="group relative hidden lg:flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white tracking-wide overflow-hidden" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})` }}>
          <User size={16} /> <span>Sign In</span>
        </Link>
      )}

      <button className="lg:hidden w-11 h-11 rounded-xl border border-gray-200/80 flex items-center justify-center bg-white/90" onClick={() => setMobileOpen(true)}>
        <Menu size={20} className="text-gray-800" />
      </button>
    </div>
  );
}