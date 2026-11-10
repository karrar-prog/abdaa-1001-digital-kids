import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Ticket,
  Award,
  GraduationCap,
  Bot,
  Rocket,
  Code2,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
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

  const triggerJoySparkle = () => {
    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.45 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <section
      id="hero"
      className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden bg-gradient-to-b from-white via-sky-50/35 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/70 dark:border-slate-800/80 transition-colors duration-300"
    >
      {/* Clean Soft Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[520px] h-[360px] bg-sky-400/12 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[420px] h-[340px] bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[340px] h-[280px] bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Kid-Tech Polka/Star Grid */}
      <div className="absolute inset-0 kid-grid-pattern opacity-70 dark:opacity-25 pointer-events-none" />

      {/* Non-intrusive Floating Creative Kid-Tech Shapes (Desktop) */}
      <div className="hidden xl:flex absolute top-14 left-12 items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-sky-800 shadow-md animate-float-slow pointer-events-none">
        <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
          <Code2 className="w-4 h-4" />
        </span>
        <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">نبرمج المستقبل بأيدينا</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Right Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-right">
            {/* Playful & Institutional Top Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={triggerJoySparkle}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-white dark:bg-slate-900 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-xs hover:border-sky-400 transition cursor-pointer btn-playful"
                title="اضغط للاحتفال!"
              >
                <img src="/brand/abdaa-logo.png" alt="شعار نادي أبدع" className="w-5 h-5 object-contain" />
                <span>نادي أبدع للمهارات الذكية – النجف الأشرف</span>
              </button>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs">
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-wiggle" />
                <span>للأطفال والناشئة (7 – 14 سنة)</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-xs">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>أبطال العرب في الابتكار 2024–2026</span>
              </span>
            </div>

            {/* Main Headline with Playful 1001 Highlight */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-slate-900 dark:text-white font-alexandria leading-[1.22] sm:leading-[1.2] tracking-tight">
                احتفالية تخرج الدفعة الأولى <br />
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  لمبادرة «1001» طفل رقمي
                </span>
              </h1>

              <div
                onClick={triggerJoySparkle}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50/80 to-sky-50 dark:from-amber-950/60 dark:to-sky-950/60 border border-amber-300/70 dark:border-amber-600/40 text-amber-900 dark:text-amber-200 font-extrabold text-sm sm:text-base font-alexandria cursor-pointer btn-playful shadow-xs"
              >
                <span>«{EVENT_DETAILS.slogan}»</span>
                <span className="text-base">🚀</span>
              </div>
            </div>

            {/* Clean Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-tajawal">
              مهرجان إبداعي وعلمي بهيج يحتفي بتخرج{' '}
              <strong className="text-sky-700 dark:text-sky-300 font-black">170 مبرمجاً ومبتكراً صغيراً</strong>{' '}
              (ضمن 10 مجموعات)، وافتتاح المعرض التفاعلي الحي لـ{' '}
              <strong className="text-amber-700 dark:text-amber-300 font-black">40 اختراعاً وابتكاراً</strong>{' '}
              في الروبوتات والذكاء الاصطناعي والبرمجة على مسرح قصر الثقافة.
            </p>

            {/* Clean 4-Card Event Specs Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3 rounded-[26px] bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_35px_-12px_rgba(15,23,42,0.08)] text-right">
              <div className="p-2.5 rounded-2xl bg-sky-50/60 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700/80 flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">الموعد</span>
                  <strong className="text-xs text-slate-900 dark:text-white font-alexandria leading-tight block">
                    {EVENT_DETAILS.dateText}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-amber-50/60 dark:bg-slate-800/80 border border-amber-100 dark:border-slate-700/80 flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">انطلاق الحفل</span>
                  <strong className="text-xs text-slate-900 dark:text-white font-alexandria leading-tight block">
                    {EVENT_DETAILS.time}
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700/80 flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">المكان</span>
                  <strong className="text-xs text-slate-900 dark:text-white font-alexandria leading-tight block">
                    قصر الثقافة
                  </strong>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700/80 flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">الدعوة</span>
                  <strong className="text-xs text-emerald-700 dark:text-emerald-400 font-alexandria leading-tight block">
                    عامة ({EVENT_DETAILS.capacity})
                  </strong>
                </div>
              </div>
            </div>

            {/* Bouncy Playful Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onOpenRSVP}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-sm sm:text-base font-black text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 btn-playful cursor-pointer"
              >
                <Ticket className="w-5 h-5" />
                <span>احجز مقعدك واستلم رمز QR</span>
              </button>

              {onOpenBatch2 && (
                <button
                  type="button"
                  onClick={() => onOpenBatch2(10)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm sm:text-base font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 border border-amber-300 shadow-md shadow-amber-500/20 btn-playful cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>تسجيل طفل للدفعة الثانية (7–14 سنة)</span>
                </button>
              )}

              <a
                href="#projects"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs btn-playful"
              >
                <span>معرض الـ 40 مشروعاً</span>
                <ArrowLeft className="w-4 h-4 text-sky-600" />
              </a>

              <MasdarBadge labelText="الشريك المنظم" />
            </div>
          </div>

          {/* Left Column: Visual Showcase with Floating Playful Kid Badges */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Floating Playful Badge 1: Top Right Robot */}
              <div
                onClick={triggerJoySparkle}
                className="absolute -top-4 -right-3 sm:-right-5 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 shadow-xl animate-float-slow cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-slate-800 p-1 flex items-center justify-center animate-wiggle border border-sky-200 dark:border-slate-700">
                  <img src="/brand/abdaa-logo.png" alt="شعار نادي أبدع" className="w-full h-full object-contain" />
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-slate-400 leading-none">نادي أبدع للمهارات الذكية</span>
                  <strong className="text-xs font-black text-slate-900 dark:text-white">مبادرة 1001 طفل رقمي 🤖</strong>
                </div>
              </div>

              {/* Floating Playful Badge 2: Top Left Rocket */}
              <div
                onClick={triggerJoySparkle}
                className="absolute top-12 -left-3 sm:-left-5 z-20 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border-2 border-sky-400 shadow-xl animate-float-delayed cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                  <Rocket className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-sky-600 dark:text-sky-400 leading-none">
                    أعمار 7 – 14 سنة
                  </span>
                  <strong className="text-xs font-black text-slate-900 dark:text-white">170 خريجاً مبدعاً 🚀</strong>
                </div>
              </div>

              {/* Outer Clean Frame — Redesigned Interactive Web Poster */}
              <div className="rounded-[32px] p-3 bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-[0_24px_60px_-15px_rgba(2,132,199,0.22)] overflow-hidden relative group">
                <div className="rounded-[24px] overflow-hidden bg-gradient-to-b from-[#fdfcfb] via-[#fffdf9] to-[#f4f9ff] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-amber-300/60 dark:border-sky-800/70 relative flex flex-col justify-between pt-6 pb-4 px-4 sm:px-6">
                  {/* Top-Right & Top-Left Royal Blue Circuit Corner Arches with Gold Trim */}
                  <svg
                    className="absolute inset-x-0 top-0 w-full h-44 pointer-events-none select-none"
                    viewBox="0 0 500 180"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="royalCornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#082046" />
                        <stop offset="55%" stopColor="#0e4180" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                      <linearGradient id="goldTrimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fde68a" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#b45309" />
                      </linearGradient>
                    </defs>
                    {/* Left Royal Arch */}
                    <path d="M 0 0 L 128 0 Q 65 48 0 142 Z" fill="url(#royalCornerGrad)" />
                    <path d="M 122 0 Q 60 46 0 135 L 0 146 Q 68 52 134 0 Z" fill="url(#goldTrimGrad)" />
                    {/* Right Royal Arch */}
                    <path d="M 500 0 L 372 0 Q 435 48 500 142 Z" fill="url(#royalCornerGrad)" />
                    <path d="M 378 0 Q 440 46 500 135 L 500 146 Q 432 52 366 0 Z" fill="url(#goldTrimGrad)" />
                    {/* Circuit Traces Left */}
                    <g stroke="#bae6fd" strokeWidth="1.4" fill="none" opacity="0.65">
                      <polyline points="16,12 16,44 34,60" />
                      <circle cx="34" cy="60" r="3" fill="#bae6fd" />
                      <polyline points="42,8 42,32 58,44" />
                      <circle cx="58" cy="44" r="2.5" fill="#fde68a" />
                    </g>
                    {/* Circuit Traces Right */}
                    <g stroke="#bae6fd" strokeWidth="1.4" fill="none" opacity="0.65">
                      <polyline points="484,12 484,44 466,60" />
                      <circle cx="466" cy="60" r="3" fill="#bae6fd" />
                      <polyline points="458,8 458,32 442,44" />
                      <circle cx="442" cy="44" r="2.5" fill="#fde68a" />
                    </g>
                  </svg>

                  {/* Decorative Floating Graduation Caps & Confetti Ribbons */}
                  <span
                    className="absolute top-14 left-5 text-xl sm:text-2xl -rotate-12 animate-float-slow pointer-events-none select-none drop-shadow-sm"
                    aria-hidden="true"
                  >
                    🎓
                  </span>
                  <span
                    className="absolute top-24 right-5 text-xl sm:text-2xl rotate-12 animate-float-delayed pointer-events-none select-none drop-shadow-sm"
                    aria-hidden="true"
                  >
                    🎓
                  </span>

                  {/* 1. Top Emblem: 1001 طفل رقمي / 1001 DIGITAL KIDS */}
                  <div
                    onClick={triggerJoySparkle}
                    className="relative z-10 mx-auto flex flex-col items-center cursor-pointer"
                  >
                    <img
                      src="/brand/logo-1001-kids.png"
                      alt="شعار مبادرة 1001 طفل رقمي"
                      className="h-32 sm:h-36 w-auto object-contain drop-shadow-[0_6px_14px_rgba(12,45,87,0.12)] group-hover:scale-[1.03] transition duration-500"
                    />
                  </div>

                  {/* 2. Dual Partner Logos: Abdaa Club (Right) & Masdar IT (Left) */}
                  <div className="relative z-10 mt-3 grid grid-cols-11 items-center gap-2 py-3 px-2.5 sm:px-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-amber-200/80 dark:border-slate-700 shadow-[0_10px_28px_-10px_rgba(14,65,128,0.12)]">
                    {/* Right Side (in RTL): Abdaa Smart Skills Club */}
                    <div
                      onClick={triggerJoySparkle}
                      className="col-span-5 flex flex-col items-center justify-center text-center cursor-pointer group/abdaa"
                    >
                      <div className="h-16 sm:h-20 flex items-center justify-center">
                        <img
                          src="/brand/abdaa-logo.png"
                          alt="شعار نادي أبدع للمهارات الذكية"
                          className="h-14 sm:h-16 w-auto object-contain group-hover/abdaa:scale-105 transition"
                        />
                      </div>
                      <span className="mt-1 text-sm sm:text-base font-black text-[#0f2d52] dark:text-white font-alexandria leading-tight">
                        نادي أبدع
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-600 dark:text-slate-300 leading-tight">
                        للمهارات الذكية
                      </span>
                    </div>

                    {/* Center Golden Ornamental Divider */}
                    <div className="col-span-1 flex flex-col items-center justify-center h-full py-1">
                      <div className="w-[1.5px] h-7 bg-gradient-to-b from-transparent via-amber-400 to-amber-500" />
                      <div className="my-1 w-3.5 h-3.5 rotate-45 rounded-[3px] border-2 border-amber-500 bg-amber-100 dark:bg-amber-950 flex items-center justify-center shadow-xs">
                        <div className="w-1 h-1 rounded-full bg-amber-600" />
                      </div>
                      <div className="w-[1.5px] h-7 bg-gradient-to-t from-transparent via-amber-400 to-amber-500" />
                    </div>

                    {/* Left Side (in RTL): Masdar Information Technology */}
                    <div
                      onClick={triggerJoySparkle}
                      className="col-span-5 flex flex-col items-center justify-center text-center cursor-pointer group/masdar"
                    >
                      <div className="h-16 sm:h-20 flex items-center justify-center px-1">
                        <img
                          src="/brand/masdar-logo-full-clean.png"
                          alt="شركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات"
                          className="inline-block dark:hidden max-h-14 sm:max-h-16 w-auto object-contain group-hover/masdar:scale-105 transition"
                        />
                        <img
                          src="/brand/masdar-logo-full-white.png"
                          alt="شركة المصدر لتكنولوجيا المعلومات وتطوير البرمجيات"
                          className="hidden dark:inline-block max-h-14 sm:max-h-16 w-auto object-contain group-hover/masdar:scale-105 transition"
                        />
                      </div>
                      <span className="mt-1 text-sm sm:text-base font-black text-[#0f2d52] dark:text-white font-alexandria leading-tight">
                        شركة المصدر
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-sky-700 dark:text-sky-300 leading-tight">
                        لتكنولوجيا المعلومات
                      </span>
                    </div>
                  </div>

                  {/* 3. Poster Headline & Organizing Partners Banner */}
                  <div className="relative z-10 mt-4 mb-3 text-center space-y-1.5 px-1">
                    <h3 className="text-lg sm:text-xl font-black text-[#0a284e] dark:text-white font-alexandria leading-snug">
                      احتفالية تخرج الدفعة الأولى
                    </h3>
                    <div className="text-base sm:text-lg font-black font-alexandria leading-snug">
                      <span className="text-[#0a284e] dark:text-slate-100">من مبادرة </span>
                      <span className="text-[#ea580c] dark:text-amber-400">1001 طفل رقمي</span>
                    </div>
                    <p className="text-[11px] sm:text-xs font-extrabold text-emerald-800 dark:text-emerald-300 pt-0.5">
                      الشركاء المنظمون: نادي أبدع للمهارات الذكية • شركة المصدر لتكنولوجيا المعلومات
                    </p>
                  </div>

                  {/* 4. Live Countdown Card Integrated Cleanly at the Bottom */}
                  <div className="relative z-10 mt-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 border border-sky-200/80 dark:border-slate-700 shadow-lg text-center">
                    <div className="flex items-center justify-center gap-2 text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>العد التنازلي لانطلاق فرحة التخرج 🎉</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-sky-50/70 dark:bg-slate-800 rounded-xl p-2 border border-sky-100 dark:border-slate-700">
                        <span className="block text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-alexandria">
                          {timeLeft.days}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">يوم</span>
                      </div>
                      <div className="bg-sky-50/70 dark:bg-slate-800 rounded-xl p-2 border border-sky-100 dark:border-slate-700">
                        <span className="block text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 font-alexandria">
                          {timeLeft.hours}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">ساعة</span>
                      </div>
                      <div className="bg-sky-50/70 dark:bg-slate-800 rounded-xl p-2 border border-sky-100 dark:border-slate-700">
                        <span className="block text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 font-alexandria">
                          {timeLeft.minutes}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">دقيقة</span>
                      </div>
                      <div className="bg-amber-50/80 dark:bg-slate-800 rounded-xl p-2 border border-amber-200/70 dark:border-slate-700">
                        <span className="block text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400 font-alexandria">
                          {timeLeft.seconds}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">ثانية</span>
                      </div>
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
