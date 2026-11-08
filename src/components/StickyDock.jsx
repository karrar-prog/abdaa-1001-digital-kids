import React from 'react';
import { Ticket, QrCode, GraduationCap } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';

export default function StickyDock({ onOpenRSVP, onOpenChecker, onOpenBatch2 }) {
  return (
    <div className="fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-30 max-w-2xl mx-auto transition-all">
      <div className="glass-panel border border-brand-500/40 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 shadow-2xl flex items-center justify-between gap-2.5 sm:gap-4 text-right">
        
        {/* Event Quick Info */}
        <div className="flex items-center gap-2 sm:gap-3 truncate">
          <div className="hidden xs:flex sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-brand-500/20 border border-brand-500/30 items-center justify-center text-brand-400 shrink-0">
            <Ticket className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
          <div className="truncate">
            <strong className="text-xs sm:text-sm text-white font-alexandria block truncate">
              حفل تخرج «1001» طفل رقمي
            </strong>
            <span className="text-[10px] sm:text-[11px] text-slate-300 flex items-center gap-1.5 truncate">
              <span>{EVENT_DETAILS.dateText}</span>
              <span>•</span>
              <span className="text-accent-cyan truncate">قصر الثقافة</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenChecker}
            className="hidden md:flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-accent-cyan" />
            <span>فحص</span>
          </button>

          {onOpenBatch2 && (
            <button
              onClick={() => onOpenBatch2(10)}
              className="flex items-center gap-1 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition whitespace-nowrap cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>الدفعة 2</span>
            </button>
          )}

          <button
            onClick={onOpenRSVP}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-accent-teal hover:from-brand-500 hover:to-accent-cyan shadow-md shadow-brand-500/25 transition transform hover:scale-105 whitespace-nowrap cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>احجز تذكرتك</span>
          </button>
        </div>

      </div>
    </div>
  );
}
