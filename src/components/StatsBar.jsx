import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { Users, GraduationCap, Award, Lightbulb, Trophy } from 'lucide-react';

const statIcons = [Users, GraduationCap, Award, Lightbulb, Trophy];
const statColors = [
  { bg: 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-800' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-800' },
  { bg: 'bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-800' },
  { bg: 'bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800' },
  { bg: 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-800' }
];

export default function StatsBar() {
  return (
    <section className="py-10 sm:py-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3 text-right">
          <div>
            <span className="text-xs font-bold text-sky-700 dark:text-sky-300 tracking-wider uppercase bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800 inline-block mb-2">
              حصاد المبادرة بالأرقام
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-alexandria">
              إنجازات صنعتها عقول أطفالنا في النجف الأشرف
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            أرقام حقيقية توثق رحلة التدريب والانتقال من مرحلة الاستخدام إلى الإبداع والإنتاج.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {EVENT_DETAILS.stats.map((stat, idx) => {
            const Icon = statIcons[idx % statIcons.length];
            const color = statColors[idx % statColors.length];
            const isLast = idx === 4;

            return (
              <div 
                key={idx}
                className={`tech-card rounded-2xl p-4 sm:p-5 text-right flex flex-col justify-between ${
                  isLast ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">0{idx + 1}</span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-alexandria tracking-tight mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
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