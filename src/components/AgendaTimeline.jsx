import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { Clock, Calendar, CheckCircle2, Sparkles, MapPin } from 'lucide-react';

export default function AgendaTimeline() {
  return (
    <section id="agenda" className="py-14 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 relative z-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold text-sky-700 dark:text-sky-300 tracking-wider uppercase bg-sky-50 dark:bg-sky-950/60 px-3.5 py-1.5 rounded-full border border-sky-200 dark:border-sky-800">
            المنهاج الزمني للحفل
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3 font-alexandria">
            برنامج تسلسل فقرات يوم التخرج
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2">
            جدول زمني متقن يبدأ من استقبال العائلات وافتتاح المعرض وحتى تتويج الـ 170 خريجاً وتكريم المدربين والشركاء.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative border-r-2 border-slate-200 dark:border-slate-800 pr-6 mr-4 sm:mr-8 space-y-6">
          {EVENT_DETAILS.agenda.map((item, idx) => (
            <div key={idx} className="relative group">
              
              {/* Dot Indicator */}
              <div className={`absolute -right-[31px] top-4 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                item.highlight ? 'bg-sky-600 ring-4 ring-sky-100 dark:ring-sky-950 scale-125' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-sky-500'
              } transition-all`} />

              {/* Card */}
              <div className={`p-5 sm:p-6 rounded-2xl transition-all text-right ${
                item.highlight 
                  ? 'bg-blue-50/70 dark:bg-slate-800/90 border border-blue-200 dark:border-sky-800/70 shadow-sm' 
                  : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-alexandria shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>{item.time}</span>
                  </span>
                  {item.highlight && (
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      فقرة رئيسية
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-alexandria mb-1.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Location note */}
        <div className="mt-12 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>المكان الرسمي: قصر الثقافة – النجف الأشرف • الحضور المباشر الساعة 2:00 بعد الظهر</span>
        </div>

      </div>
    </section>
  );
}