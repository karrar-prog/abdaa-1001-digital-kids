import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Sparkles, ArrowLeft, Ticket, Award, GraduationCap } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';
import MasdarBadge from './MasdarBadge';

export default function Hero({ onOpenRSVP, onOpenBatch2 }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(EVENT_DETAILS.eventDateISO).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative pt-8 sm:pt-14 pb-14 sm:pb-24 overflow-hidden bg-gradient-to-b from-white via-sky-50/30 to-slate-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      
      {/* Ambient background soft lightings */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[350px] bg-sky-400/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/4 left-10 w-[400px] h-[350px] bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      
      {/* Subtle tech dot matrix grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0284c715_1px,transparent_1px)] dark:bg-[radial-gradient(#38bdf818_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Asymmetrical 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Right Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-900 text-sky-800 dark:text-sky-300 border border-sky-200/90 dark:border-sky-800 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <span>نادي أبدع للمهارات الذكية – النجف الأشرف</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>للأطفال والناشئة (7 – 14 سنة)</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-sm">
                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>أبطال العرب في الابتكار 2024–2026</span>
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-900 dark:text-white font-alexandria leading-[1.2] sm:leading-[1.2] tracking-tight">
                احتفالية تخرج الدفعة الأولى <br />
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  لمبادرة «1001» طفل رقمي
                </span>
              </h1>
              
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/60 border border-amber-400/40 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 font-bold text-sm sm:text-base font-alexandria">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>«{EVENT_DETAILS.slogan}»</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-tajawal">
              ملتقى وطني يحتفي بنجاح وتخرج <strong className="text-slate-900 dark:text-white font-bold">170 طفلاً وطفلة</strong> في البرمجة والروبوتات والذكاء الاصطناعي، وافتتاح المعرض التقني الحي لـ <strong className="text-slate-900 dark:text-white font-bold">40 مشروعاً ابتكارياً</strong> يقدمها الأطفال بأنفسهم في قصر الثقافة بالنجف الأشرف.
            </p>

            {/* Event Key Specs Ribbon - Clean Glassmorphism */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/90 dark:border-slate-800 shadow-sm text-right">
              
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100/80 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">الموعد</span>
                  <strong className="text-xs sm:text-sm text-slate-800 dark:text-white font-alexandria">{EVENT_DETAILS.dateText}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100/80 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">انطلاق الحفل</span>
                  <strong className="text-xs sm:text-sm text-slate-800 dark:text-white font-alexandria">{EVENT_DETAILS.time}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100/80 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">المكان</span>
                  <strong className="text-xs sm:text-sm text-slate-800 dark:text-white font-alexandria">قصر الثقافة</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">السعة</span>
                  <strong className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-alexandria">{EVENT_DETAILS.capacity}</strong>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenRSVP}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-sm sm:text-base font-bold text-white bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-xl shadow-sky-500/25 hover:shadow-2xl hover:shadow-sky-500/35 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <Ticket className="w-5 h-5" />
                <span>احجز مقعدك واستلم رمز QR</span>
              </button>

              {onOpenBatch2 && (
                <button
                  type="button"
                  onClick={() => onOpenBatch2(10)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm sm:text-base font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>تسجيل طفل للدفعة الثانية (7–14 سنة)</span>
                </button>
              )}

              <a
                href="#projects"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition hover:text-sky-600 dark:hover:text-sky-400"
              >
                <span>معرض الـ 40 مشروعاً</span>
                <ArrowLeft className="w-4 h-4" />
              </a>

              <MasdarBadge labelText="الشريك التقني" />
            </div>

          </div>

          {/* Left Column: Visual Showcase & Floating Live Countdown */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative card frame with soft floating shadow */}
              <div className="rounded-3xl p-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_50px_rgba(8,112,184,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
                
                {/* Official Event Banner / Poster */}
                <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[4/5] relative">
                  <img 
                    src="/banners/event_poster.jpg" 
                    alt="احتفالية مبادرة 1001 طفل رقمي" 
                    className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white text-right">
                    <span className="text-xs font-bold text-amber-400">نادي أبدع للمهارات الذكية</span>
                    <h3 className="text-lg font-bold font-alexandria leading-snug">
                      حفل تخرج الدفعة الأولى • 170 طفلاً رقمياً
                    </h3>
                  </div>
                </div>

                {/* Floating Live Countdown Card */}
                <div className="absolute -bottom-2 left-4 right-4 sm:left-6 sm:right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
                  <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>العد التنازلي لانطلاق الاحتفالية</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-slate-50/90 dark:bg-slate-800/80 rounded-xl p-2 border border-slate-100 dark:border-slate-700/80">
                      <span className="block text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-alexandria">{timeLeft.days}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">يوم</span>
                    </div>
                    <div className="bg-slate-50/90 dark:bg-slate-800/80 rounded-xl p-2 border border-slate-100 dark:border-slate-700/80">
                      <span className="block text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 font-alexandria">{timeLeft.hours}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">ساعة</span>
                    </div>
                    <div className="bg-slate-50/90 dark:bg-slate-800/80 rounded-xl p-2 border border-slate-100 dark:border-slate-700/80">
                      <span className="block text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 font-alexandria">{timeLeft.minutes}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">دقيقة</span>
                    </div>
                    <div className="bg-slate-50/90 dark:bg-slate-800/80 rounded-xl p-2 border border-slate-100 dark:border-slate-700/80">
                      <span className="block text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400 font-alexandria">{timeLeft.seconds}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">ثانية</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}