import React, { useState } from 'react';
import { Bot, Sparkles, Rocket, Star, Code2, X, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

const ROBOT_TIPS = [
  {
    badge: '🤖 روبوت أبدع يرحب بك!',
    text: 'أهلاً بك يا بطل المستقبل! هل تعلم أن 170 طفلاً (بعمر 7 إلى 14 سنة) صمموا 40 اختراعاً حقيقياً بأيديهم في هذا الحفل؟',
    actionLabel: 'شاهد الـ 40 ابتكاراً 🚀',
    href: '#projects'
  },
  {
    badge: '🌟 الفئة العمرية (7 – 9 سنوات)',
    text: 'في مرحلة «المستكشف الرقمي» يتحول الطفل من لاعب ألعاب إلى مبرمج يصنع قصصه وألعابه الخاصة بـ Scratch والروبوتات!',
    actionLabel: 'اكتشف مسارك العمري 🧩',
    href: '#tracks'
  },
  {
    badge: '🏆 أبطال العرب (2024 – 2026)',
    text: 'أصدقاؤنا مريم ومحمد فراس نزار فازوا بالمركز الأول عربياً لـ 3 سنوات متتالية، واليوم يدربون أقرانهم في النجف الأشرف!',
    actionLabel: 'اقرأ قصة الإلهام ⭐',
    href: '#story'
  },
  {
    badge: '🎓 بطاقة Digital Kid الذكية',
    text: 'لكل خريج من الـ 170 بطاقة ذكية وشهادة معتمدة برمز QR يمكنك استعراضها وطباعتها فوراً من الموقع!',
    actionLabel: 'جرب طباعة البطاقة 🖨️',
    href: '#graduates'
  }
];

export function InteractiveRobotCompanion({ onOpenBatch2 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const currentTip = ROBOT_TIPS[tipIndex % ROBOT_TIPS.length];

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { x: 0.9, y: 0.85 }
        });
      } catch {
        // ignore
      }
    } else {
      setIsOpen(false);
    }
  };

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % ROBOT_TIPS.length);
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { x: 0.9, y: 0.85 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Speech Bubble Popup */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 rounded-[26px] bg-white dark:bg-slate-900 border-2 border-sky-400 dark:border-sky-500 p-4 shadow-[0_20px_50px_rgba(2,132,199,0.25)] text-right animate-fadeIn relative">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-3 left-3 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{currentTip.badge}</span>
          </div>

          <p className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-200 leading-relaxed mb-3">
            {currentTip.text}
          </p>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <a
              href={currentTip.href}
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[11px] font-black shadow-sm hover:opacity-95 transition"
            >
              {currentTip.actionLabel}
            </a>

            <button
              type="button"
              onClick={handleNextTip}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1"
            >
              <PartyPopper className="w-3.5 h-3.5 text-amber-500" />
              <span>معلومة أخرى</span>
            </button>
          </div>

          {onOpenBatch2 && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenBatch2(10);
              }}
              className="mt-2.5 w-full py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-900 dark:text-amber-300 text-[11px] font-black transition cursor-pointer"
            >
              ✨ سجّل طفلك الآن في الدفعة الثانية (7–14 سنة)
            </button>
          )}
        </div>
      )}

      {/* Floating Playful Robot Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="group relative flex items-center gap-2.5 pl-3.5 pr-2 py-2 rounded-full bg-white dark:bg-slate-900 border-2 border-sky-400 dark:border-sky-500 shadow-[0_12px_30px_rgba(2,132,199,0.25)] hover:shadow-[0_16px_36px_rgba(2,132,199,0.38)] btn-playful cursor-pointer"
        title="تحدث مع روبوت أبدع الذكي"
      >
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-inner animate-wiggle">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
        </div>
        <div className="text-right hidden sm:block">
          <span className="block text-[10px] font-extrabold text-sky-600 dark:text-sky-400 leading-none">
            صديقك الذكي
          </span>
          <strong className="text-xs font-black text-slate-900 dark:text-white font-alexandria">
            روبوت أبدع 🤖
          </strong>
        </div>
      </button>
    </div>
  );
}
