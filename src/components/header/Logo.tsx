import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { ACCENT, ACCENT2 } from './navData';

export default function Logo() {
  return (
    <div>
      <Link href="/" className="flex items-center gap-3 no-underline shrink-0">
        <div
          className="w-11 h-11 rounded-[13px] flex items-center justify-center shadow-lg"
          style={{
            background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`,
            boxShadow: `0 8px 20px ${ACCENT}30`,
          }}
        >
          <BookOpen size={20} color="white" />
        </div>

        <div>
          <p className="hdr-serif text-[26px] font-bold text-gray-900 leading-none tracking-tight">
            Neelgiri
            <span style={{ color: ACCENT }}>Public</span>
          </p>
          <p className="text-[9px] uppercase tracking-[0.22em] text-gray-400 mt-1">
            School
          </p>
        </div>
      </Link>
    </div>
  );
}