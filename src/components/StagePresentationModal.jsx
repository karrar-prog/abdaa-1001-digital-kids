import React, { useState, useEffect } from 'react';
import {
  X,
  Tv,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Award,
  Play,
  Pause,
  Users,
  GraduationCap,
  Printer,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { GRADUATION_COHORTS } from '../data/cohortsData';
import { openGraduateBadgePrintWindow, openGraduateCertificatePrintWindow } from '../utils/printEngine';

export default function StagePresentationModal({ isOpen, onClose, initialGroupIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialGroupIndex || 0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [highlightedGrad, setHighlightedGrad] = useState(null);

  useEffect(() => {
    if (!isOpen || !isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GRADUATION_COHORTS.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [isOpen, isAutoPlay]);

  if (!isOpen) return null;

  const cohort = GRADUATION_COHORTS[currentIndex] || GRADUATION_COHORTS[0];

  const triggerStageConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 95,
      origin: { y: 0.55 }
    });
  };

  const handlePrintGrad = async (grad, mode = 'cert') => {
    const verifyPayload = JSON.stringify({
      type: 'ABDAA_1001_DIGITAL_KID',
      id: grad.id,
      code: grad.initiativeCode,
      name: grad.name,
      ageGroup: grad.ageGroup,
      track: grad.track
    });
    const qrUrl = await QRCode.toDataURL(verifyPayload, {
      width: 240,
      margin: 1,
      color: { dark: '#09152b', light: '#ffffff' }
    });
    if (mode === 'badge') {
      openGraduateBadgePrintWindow(grad, qrUrl);
    } else {
      openGraduateCertificatePrintWindow(grad, qrUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050c1a] text-white flex flex-col overflow-hidden">
      {/* Ambient Stage Spotlights */}
      <div className="pointer-events-none absolute -top-36 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -top-36 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />

      {/* Top Stage Control Bar */}
      <div className="relative z-10 px-4 sm:px-8 py-4 bg-slate-950/90 border-b-2 border-amber-400/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/20">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2.5 py-0.5 rounded-full">
                شاشة مسرح قصر الثقافة • النجف الأشرف
              </span>
              <span className="text-xs font-extrabold text-amber-300">
                تكريم 170 خريجاً (10 مجموعات • أعمار 7 – 14 سنة)
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white mt-0.5">
              نادي أبدع للمهارات الذكية — احتفالية تخرج الدفعة الأولى لمبادرة «1001» طفل رقمي
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={triggerStageConfetti}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>احتفال التتويج</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAutoPlay((v) => !v)}
            className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 border transition ${
              isAutoPlay
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
            }`}
          >
            {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAutoPlay ? 'إيقاف التبديل التلقائي' : 'عرض تلقائي للمسرح'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen?.();
              } else {
                document.exitFullscreen?.();
              }
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            title="ملء الشاشة"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-black text-xs flex items-center gap-1 transition"
          >
            <X className="w-4 h-4" />
            <span>إغلاق شاشة المسرح</span>
          </button>
        </div>
      </div>

      {/* Cohort Selector Ribbon (Groups 1 to 10) */}
      <div className="relative z-10 bg-slate-900/90 border-b border-white/10 px-4 sm:px-8 py-2.5 flex items-center gap-2 overflow-x-auto">
        {GRADUATION_COHORTS.map((c, idx) => (
          <button
            key={c.code}
            type="button"
            onClick={() => {
              setCurrentIndex(idx);
              setHighlightedGrad(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition flex items-center gap-1.5 ${
              currentIndex === idx
                ? 'bg-gradient-to-l from-amber-400 to-amber-500 text-slate-950 shadow-md scale-105'
                : 'bg-white/5 text-slate-300 hover:bg-white/15 border border-white/10'
            }`}
          >
            <span>المجموعة {c.groupNumber}</span>
            <span className="text-[10px] opacity-80">({c.ageStage})</span>
          </button>
        ))}
      </div>

      {/* Main Stage Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 py-6 flex flex-col justify-between">
        {/* Cohort Banner */}
        <div className="bg-gradient-to-l from-slate-900/95 via-sky-950/90 to-slate-900/95 border-2 border-amber-400/60 rounded-3xl p-5 mb-5 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg shrink-0">
              <span className="text-[10px] leading-none">المجموعة</span>
              <span className="text-2xl leading-tight">{cohort.groupNumber}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black bg-sky-500 text-white px-3 py-0.5 rounded-full">
                  الفئة العمرية: {cohort.ageStage}
                </span>
                <span className="text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-0.5 rounded-full">
                  المسار: {cohort.track}
                </span>
                <span className="text-xs text-slate-300 font-bold">
                  إشراف المدرب: <strong className="text-white">{cohort.mentor}</strong>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">{cohort.name}</h3>
              <p className="text-xs text-sky-300 font-bold mt-0.5">« {cohort.motto} »</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + GRADUATION_COHORTS.length) % GRADUATION_COHORTS.length)
              }
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition"
              title="المجموعة السابقة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 block">عدد المكرمين بالمجموعة</span>
              <span className="text-sm font-black text-amber-300">{cohort.graduates.length} خريجاً</span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % GRADUATION_COHORTS.length)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition"
              title="المجموعة التالية"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 17 Graduates Grid for Current Cohort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 my-auto">
          {cohort.graduates.map((grad, idx) => {
            const isSelected = highlightedGrad?.id === grad.id;
            return (
              <div
                key={grad.id}
                onClick={() => setHighlightedGrad(grad)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-sky-900 to-slate-900 border-amber-400 ring-2 ring-amber-400/40 scale-[1.02]'
                    : 'bg-slate-900/85 hover:bg-slate-800/90 border-white/15 hover:border-sky-400/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                      {(currentIndex * 17) + idx + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-sm sm:text-base text-white leading-snug">
                        {grad.name}
                      </h4>
                      <span className="font-mono text-[11px] font-bold text-sky-400">{grad.initiativeCode}</span>
                    </div>
                  </div>
                  <Award className="w-5 h-5 text-amber-400 shrink-0" />
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 text-xs space-y-1">
                  <div className="text-slate-300 truncate">
                    <span className="text-slate-400">المشروع: </span>
                    <strong className="text-sky-200">{grad.project}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-300">{grad.grade}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrintGrad(grad, 'badge');
                        }}
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-sky-600 text-[10px] font-black text-white transition"
                        title="طباعة البطاقة"
                      >
                        البطاقة
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrintGrad(grad, 'cert');
                        }}
                        className="px-2 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400 hover:text-slate-950 text-[10px] font-black text-amber-300 transition flex items-center gap-1"
                        title="طباعة الشهادة A4"
                      >
                        <Printer className="w-3 h-3" />
                        <span>الشهادة</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stage Footer Ticker */}
        <div className="mt-5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>
              انقر على اسم أي خريج على الشاشة لإبراز بطاقته أو طباعة شهادة التخرج الرسمية المعتمدة (A4) فوراً.
            </span>
          </div>
          <div className="font-bold text-sky-300">
            الشريك التقني والراعي الرسمي: شركة المصدر لتكنولوجيا المعلومات • بالتعاون مع نقابة المبرمجين العراقيين
          </div>
        </div>
      </div>
    </div>
  );
}
