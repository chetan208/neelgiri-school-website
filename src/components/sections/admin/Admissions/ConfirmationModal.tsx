'use client';

import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  isError?: boolean;
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, isError }: ConfirmationModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06283D]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all scale-100 animate-in zoom-in-95">
        <h3 className={`text-base font-bold ${isError ? 'text-rose-600' : 'text-[#06283D]'}`}>{title}</h3>
        <p className="text-xs text-[#06283D]/60 mt-2 font-medium leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-5">
          {onConfirm && (
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-[#F8FAFC] text-[#06283D] rounded-lg text-xs font-semibold hover:bg-[#093C5D]/10 transition-colors border-0 cursor-pointer">
              Cancel
            </button>
          )}
          <button 
            onClick={onConfirm || onClose} 
            className={`flex-1 px-4 py-2 text-white rounded-lg text-xs font-semibold transition-colors border-0 cursor-pointer ${isError ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#FA6781] hover:bg-[#093C5D]'}`}
          >
            {onConfirm ? 'Confirm' : 'Okay'}
          </button>
        </div>
      </div>
    </div>
  );
}