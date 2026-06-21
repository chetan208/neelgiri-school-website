import React from 'react';
import Link from 'next/link';

export default function Logo() {
  return (
    <div>
      <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0 group ">
        <img
          src="/school_logo.png"
          alt="Neelgiri Public Sr. Sec. School Logo"
          className="w-11 h-11 rounded-full object-contain shadow-md transition-transform duration-300 group-hover:scale-105"
          
        />

        <div className="flex flex-col justify-center">
          <p className="hdr-serif text-[20px] sm:text-[22px] font-extrabold text-[#093C5D] leading-none tracking-tight">
            Neelgiri Public
          </p>
          <p className="hidden sm:block text-[9px] uppercase tracking-[0.05em] text-[#06283D] font-bold mt-1">
            Sr. Sec. School, Lower Hatwas
          </p>
        </div>
      </Link>
    </div>
  );
}