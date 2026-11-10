import React, { useState } from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { Users, GraduationCap, Award, Lightbulb, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

const statIcons = [Users, GraduationCap, Award, Lightbulb, Trophy];
const statEmojis = ['👦👧', '🎯', '🎓', '🤖', '🌟'];
const statColors = [
  {
    bg: 'bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400',
    border: 'border-sky-200 dark:border-sky-800',
    bar: 'from-sky-400 to-blue-500'
  },
  {
    bg: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    bar: 'from-emerald-400 to-teal-500'
  },
  {
    bg: 'bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    bar: 'from-amber-400 to-orange-500'
  },
  {
    bg: 'bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    bar: 'from-purple-400 to-indigo-500'
  },
  {
    bg: 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800',
    bar: 'from-rose-400 to-pink-500'
  }
];

export default function StatsBar() {
  const [activeIdx, setActiveIdx] = useState(null);

  const handleCardClick = (idx) => {
    setActiveIdx(idx);
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.65 }
      });
    } catch {
      // ignore
    }
    setTimeout(() => setActiveIdx(null), 1500);
  };

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800/80 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-9 gap-3 text-right">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-3.5 py-1.5 rounded-full border border-sky-200 dark:border-sky-800 mb-2.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>حصاد المبادرة بالأرقام (الأعمار 7 – 14 سنة)</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-alexandria">
              إنجازات صنعتها عقول أطفالنا في النجف الأشرف
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            اضغط على أي بطاقة للاحتفال بأرقام أبطالنا المبتكرين في الدفعة الأولى!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {EVENT_DETAILS.stats.map((stat, idx) => {
            const Icon = statIcons[idx % statIcons.length];
            const color = statColors[idx % statColors.length];
            const emoji = statEmojis[idx % statEmojis.length];
            const isLast = idx === 4;
            const isPopped = activeIdx === idx;

            return (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                className={`tech-card relative overflow-hidden p-5 text-right flex flex-col justify-between cursor-pointer select-none group ${
                  isLast ? 'col-span-2 sm:col-span-1' : ''
                } ${isPopped ? 'ring-4 ring-amber-400/50 scale-105' : ''}`}
              >
                {/* Top Colorful Playful Bar */}
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${color.bar}`} />

                <div className="flex items-center justify-between mb-3 pt-1">
                  <div
                    className={`w-11 h-11 rounded-2xl ${color.bg} border ${color.border} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-lg group-hover:animate-bounce" title="إبداع أطفالنا">
                    {emoji}
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-alexandria tracking-tight mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-0.5">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {stat.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
