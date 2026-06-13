import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, X, ShieldCheck, LogOut, LogIn, Loader2, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MobileNavItem from './MobileNavItem';
import { ACCENT, NavItem } from './navData';

interface MobileDrawerProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  navItems: NavItem[];
}

export default function MobileDrawer({ mobileOpen, setMobileOpen, navItems }: MobileDrawerProps) {
  const { user, authLoading, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const flatLinks = useMemo(() => {
    const links: { label: string; to: string; parentLabel?: string }[] = [];
    navItems.forEach(item => {
      if (item.to && item.to !== "#") {
        links.push({ label: item.label, to: item.to });
      }
      if (item.dropdown) {
        item.dropdown.forEach(subItem => {
          if (subItem.to && subItem.to !== "#") {
            links.push({ label: subItem.label, to: subItem.to, parentLabel: item.label });
          }
        });
      }
    });
    return links;
  }, [navItems]);

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return flatLinks.filter(link => 
      link.label.toLowerCase().includes(q) || 
      (link.parentLabel && link.parentLabel.toLowerCase().includes(q))
    );
  }, [searchQuery, flatLinks]);

  if (!mobileOpen) return null;
  const isAdminOrSuperAdmin = user && (user.role === "Admin" || user.role === "Owner");

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setMobileOpen(false)} />
      <div className="hdr-drawer fixed top-0 right-0 bottom-0 z-[70] w-[88vw] max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#093C5D]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: ACCENT }}>
              <BookOpen size={17} color="white" />
            </div>
            <div>
              <p className="hdr-serif text-[18px] font-bold text-[#093C5D] leading-none">Neelgiri <span style={{ color: ACCENT }}>Public</span></p>
              <p className="text-[9px] uppercase tracking-widest text-[#06283D] mt-1">School</p>
            </div>
          </div>
          <button className="w-9 h-9 rounded-xl border border-[#093C5D]/25 flex items-center justify-center hover:bg-[#093C5D]/10" onClick={() => setMobileOpen(false)}>
            <X size={16} className="text-[#06283D]" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-5 py-3 border-b border-[#093C5D]/10 bg-slate-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search links or pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-[#093C5D]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#093C5D] text-slate-800 transition-all font-medium"
            />
            <span className="absolute left-3 top-2.5 text-slate-400">
              <Search size={13} />
            </span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {searchQuery.trim() ? (
            <div className="space-y-1 px-3">
              <p className="text-[10px] font-bold text-[#093C5D] uppercase tracking-wider px-3.5 mb-2.5">
                Search Results ({filteredLinks.length})
              </p>
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.to}
                    onClick={() => {
                      setSearchQuery("");
                      setMobileOpen(false);
                    }}
                    className="flex flex-col px-3.5 py-2.5 hover:bg-[#093C5D]/5 active:bg-[#093C5D]/10 rounded-xl transition duration-200 no-underline"
                  >
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {link.label}
                    </span>
                    {link.parentLabel && (
                      <span className="text-[9px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">
                        in {link.parentLabel}
                      </span>
                    )}
                  </Link>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">
                  No links match &quot;{searchQuery}&quot;
                </p>
              )}
            </div>
          ) : (
            navItems.map((item) => (
              <MobileNavItem key={item.label} item={item} onClose={() => setMobileOpen(false)} />
            ))
          )}
        </nav>

        <div className="border-t border-[#093C5D]/15 p-4 bg-[#F8FAFC]">
          {authLoading ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 size={20} className="animate-spin text-[#FFC94D]" />
            </div>
          ) : user ? (
            <div className="flex flex-col gap-3">
              <div onClick={() => { setMobileOpen(false); router.push("/me"); }} className="flex items-center gap-3 p-2.5 rounded-xl border border-[#093C5D]/20 bg-white hover:bg-[#FFC94D]/30 transition-all cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-[#093C5D] flex items-center justify-center font-bold text-sm text-white uppercase shadow-sm overflow-hidden shrink-0">
                  {user.imageUrl ? <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" /> : user.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#093C5D] truncate leading-tight">{user.name}</p>
                  <p className="text-[11px] text-[#06283D]/60 font-medium truncate mt-0.5">{user.role}</p>
                </div>
              </div>
              {isAdminOrSuperAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FA6781] border border-[#FA6781] shadow-sm hover:bg-[#FFC94D] hover:text-[#093C5D] hover:border-[#FFC94D] transition-colors">
                  <ShieldCheck size={15} /> Admin Panel
                </Link>
              )}
              <button onClick={async () => { setMobileOpen(false); await logout(); router.push("/auth"); }} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100/70 transition-all cursor-pointer">
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          ) : (
            <Link href="/auth" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-bold text-sm text-white shadow-md bg-[#FA6781] hover:bg-[#FFC94D] hover:text-[#093C5D] transition-colors" style={{}}>
              <LogIn size={16} /> <span>Sign In to Account</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}