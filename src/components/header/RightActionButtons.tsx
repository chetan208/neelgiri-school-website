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
        <Loader2 size={18} className="animate-spin text-[#FFC94D]" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 ml-auto lg:ml-0 relative">
      {user ? (
        <div className="hidden lg:flex items-center gap-3">
          {isAdminOrSuperAdmin && !isCurrentlyOnAdminPage && (
            <Link href="/admin" className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FA6781] border border-[#FA6781] hover:bg-[#FFC94D] hover:text-[#093C5D] hover:border-[#FFC94D] transition-all shadow-sm flex items-center gap-1">
              <ShieldCheck size={14} /> Admin Panel
            </Link>
          )}

          <div className="relative py-2" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <button onClick={() => router.push("/me")} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-[#093C5D]/20 bg-white hover:border-[#FFC94D] hover:bg-[#FFC94D]/10 transition-all text-left outline-none cursor-pointer shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#093C5D] flex items-center justify-center font-bold text-xs text-white uppercase overflow-hidden shadow-sm shrink-0">
                {user.imageUrl ? <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" /> : user.name?.charAt(0)}
              </div>
              <span className="text-xs font-bold text-[#093C5D] tracking-wide pr-0.5 max-w-[120px] truncate">
                {user.name}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-[#093C5D]/20 rounded-xl shadow-xl py-1.5 z-50">
                <button onClick={() => { setDropdownOpen(false); router.push("/me"); }} className="w-full px-4 py-2 text-left text-xs font-semibold text-[#093C5D] hover:bg-[#093C5D]/10 transition-colors duration-150 flex items-center gap-2 cursor-pointer">
                  <User size={14} className="text-[#093C5D]/80" /> My Profile
                </button>
                <div className="border-t border-[#093C5D]/20 my-1" />
                <button onClick={async () => { setDropdownOpen(false); await logout(); router.push("/auth"); }} className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Link href="/auth" className="group relative hidden lg:flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white tracking-wide bg-[#FA6781] hover:bg-[#FFC94D] hover:text-[#093C5D] transition-colors" style={{}}>
          <User size={16} /> <span>Sign In</span>
        </Link>
      )}

      <button className="lg:hidden w-11 h-11 rounded-xl border border-[#093C5D]/25 flex items-center justify-center bg-white hover:bg-[#FFC94D]/30" onClick={() => setMobileOpen(true)}>
        <Menu size={20} className="text-[#093C5D]" />
      </button>
    </div>
  );
}