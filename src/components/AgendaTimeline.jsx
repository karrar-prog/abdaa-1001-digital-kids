import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { Clock, Sparkles, MapPin, Star } from 'lucide-react';

const AGENDA_EMOJIS = ['🎪', '🇮🇶', '🎬', '🎤', '👦👧', '🤖', '🎓', '🎁', '📸'];

export default function AgendaTimeline() {
  return (
    <section
      id="agenda"
      className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800/80 relative z-10 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-4 py-1.5 rounded-full border border-sky-200 dark:border-sky-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>المنهاج الزمني للاحتفالية ⏰</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3 font-alexandria">
            برنامج تسلسل فقرات يوم التخرج
          </h2>
          <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 mt-2">
            رحلة احتفالية ممتعة تبدأ من افتتاح معرض الـ 40 ابتكاراً وحتى تتويج الـ 170 خريجاً على مسرح قصر الثقافة.
          </p>
        </div>

        {/* Clean Playful Timeline */}
        <div className="relative border-r-2 border-sky-200 dark:border-slate-800 pr-6 mr-4 sm:mr-8 space-y-5">
          {EVENT_DETAILS.agenda.map((item, idx) => {
            const emoji = AGENDA_EMOJIS[idx % AGENDA_EMOJIS.length];
            return (
              <div key={idx} className="relative group">
                {/* Timeline Node Dot */}
                <div
                  className={`absolute -right-[33px] top-5 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                    item.highlight
                      ? 'bg-amber-400 ring-4 ring-amber-100 dark:ring-amber-950 scale-110'
                      : 'bg-sky-500 ring-4 ring-sky-50 dark:ring-slate-800 group-hover:scale-125'
                  } transition-all`}
                />

                {/* Card */}
                <div
                  className={`tech-card p-5 sm:p-6 text-right ${
                    item.highlight
                      ? 'bg-gradient-to-l from-sky-50/80 via-white to-amber-50/40 dark:from-slate-800/90 dark:to-slate-900 border-sky-300 dark:border-sky-700'
                      : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg group-hover:scale-125 transition-transform inline-block">
                        {emoji}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-slate-700 font-alexandria">
                        <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        <span>{item.time}</span>
                      </span>
                    </div>

                    {item.highlight && (
                      <span className="text-[11px] font-black text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>فقرة رئيسية مميزة</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-alexandria mb-1.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Location Banner */}
        <div className="mt-12 p-4 rounded-2xl bg-sky-50/60 dark:bg-slate-800/80 border border-sky-200/70 dark:border-slate-800 text-center text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 animate-bounce" />
          <span>المكان الرسمي: قصر الثقافة – النجف الأشرف • فتح أبواب المعرض الساعة 2:00 بعد الظهر</span>
        </div>
      </div>
    </section>
  );
}
