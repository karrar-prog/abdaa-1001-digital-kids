import React, { useState, useMemo } from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { playClickPop } from '../utils/soundEffects';
import {
  Clock,
  MapPin,
  Calendar,
  Star,
  BookOpen,
  Mic,
  Flag,
  Landmark,
  Crown,
  Sparkles,
  MessageSquareQuote,
  Film,
  GraduationCap,
  Award,
  Trophy,
  HeartHandshake,
  Camera,
  Printer,
  LayoutList,
  Table2,
  Radio,
  ChevronRight,
  ChevronLeft,
  Timer,
  DoorOpen,
  CheckCircle2
} from 'lucide-react';

const ICON_MAP = {
  book: BookOpen,
  mic: Mic,
  flag: Flag,
  landmark: Landmark,
  crown: Crown,
  sparkles: Sparkles,
  star: Star,
  message: MessageSquareQuote,
  film: Film,
  graduation: GraduationCap,
  award: Award,
  trophy: Trophy,
  heart: HeartHandshake,
  camera: Camera
};

const PHASE_STYLES = {
  royal: {
    headerBg: 'from-[#082046] via-[#0d3168] to-[#0b234d]',
    border: 'border-sky-300/70 dark:border-sky-800/70',
    accentBar: 'from-amber-400 via-yellow-300 to-sky-400',
    pillBg: 'bg-sky-100 text-sky-900 dark:bg-sky-950/80 dark:text-sky-200 border-sky-200 dark:border-sky-800',
    activePill: 'bg-[#082046] text-amber-300 border-amber-400/70 shadow-lg shadow-sky-950/25',
    barSegment: 'from-[#0b2e66] to-[#1d4ed8]',
    railColor: 'border-sky-300/80 dark:border-sky-800',
    nodeBg: 'bg-[#082046] text-amber-300 ring-sky-100 dark:ring-sky-950',
    iconBox: 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    timeBadge: 'bg-sky-50 dark:bg-slate-800 text-sky-900 dark:text-sky-200 border-sky-200 dark:border-sky-700'
  },
  sky: {
    headerBg: 'from-sky-700 via-blue-700 to-indigo-800',
    border: 'border-indigo-300/70 dark:border-indigo-800/70',
    accentBar: 'from-sky-400 via-cyan-300 to-indigo-400',
    pillBg: 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
    activePill: 'bg-gradient-to-l from-sky-600 to-indigo-700 text-white border-sky-400 shadow-lg shadow-indigo-500/25',
    barSegment: 'from-sky-500 to-indigo-600',
    railColor: 'border-indigo-300/80 dark:border-indigo-800',
    nodeBg: 'bg-gradient-to-br from-sky-500 to-indigo-600 text-white ring-indigo-100 dark:ring-indigo-950',
    iconBox: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    timeBadge: 'bg-indigo-50 dark:bg-slate-800 text-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700'
  },
  gold: {
    headerBg: 'from-amber-700 via-amber-600 to-orange-700',
    border: 'border-amber-300/80 dark:border-amber-700/70',
    accentBar: 'from-amber-300 via-yellow-200 to-orange-400',
    pillBg: 'bg-amber-50 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border-amber-200 dark:border-amber-800',
    activePill: 'bg-gradient-to-l from-amber-500 to-orange-600 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/25',
    barSegment: 'from-amber-400 to-orange-500',
    railColor: 'border-amber-300/80 dark:border-amber-800',
    nodeBg: 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 ring-amber-100 dark:ring-amber-950',
    iconBox: 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    timeBadge: 'bg-amber-50 dark:bg-slate-800 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-700'
  },
  emerald: {
    headerBg: 'from-emerald-700 via-teal-700 to-cyan-800',
    border: 'border-emerald-300/70 dark:border-emerald-800/70',
    accentBar: 'from-emerald-300 via-teal-300 to-cyan-400',
    pillBg: 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
    activePill: 'bg-gradient-to-l from-emerald-600 to-teal-700 text-white border-emerald-400 shadow-lg shadow-emerald-500/25',
    barSegment: 'from-emerald-500 to-teal-500',
    railColor: 'border-emerald-300/80 dark:border-emerald-800',
    nodeBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white ring-emerald-100 dark:ring-emerald-950',
    iconBox: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    timeBadge: 'bg-emerald-50 dark:bg-slate-800 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700'
  }
};

export default function AgendaTimeline() {
  const [selectedPhaseId, setSelectedPhaseId] = useState('all');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'table'
  const [mcCueMode, setMcCueMode] = useState(false);
  const [activeCueIndex, setActiveCueIndex] = useState(0);

  const meta = EVENT_DETAILS.agendaMeta || {
    forumTitle: 'ملتقى النجف للابتكار الرقمي',
    programTitle: 'منهاج حفلة تخرج 1001 طفل رقمي',
    dateFull: 'يوم الجمعة الموافق 27/11/2026',
    venueFull: 'رحاب قصر الثقافة – النجف الأشرف',
    arrivalLabel: 'الوصول والترحيب: الساعة 2:00 ظهراً',
    arrivalTime: '2:00 ظهراً',
    startTime: '3:00 عصراً',
    endTime: '4:55 عصراً',
    totalDuration: 'ساعة و55 دقيقة',
    totalMinutes: 115,
    organizers: 'شركة مصدر لتطوير البرمجيات  •  نادي أبدع للمهارات الذكية'
  };

  const phases = EVENT_DETAILS.agendaPhases || [];
  const agendaItems = EVENT_DETAILS.agenda || [];

  // Map global sequential index (1..N) onto every agenda item
  const indexedAgenda = useMemo(
    () => agendaItems.map((item, idx) => ({ ...item, globalIndex: idx })),
    [agendaItems]
  );

  // Group items into their official 4 phases + any admin-added uncategorized items
  const phaseGroups = useMemo(() => {
    const knownIds = new Set(phases.map((p) => p.id));
    const groups = phases
      .map((phase) => ({
        phase,
        items: indexedAgenda.filter((item) => item.phaseId === phase.id)
      }))
      .filter((g) => g.items.length > 0);

    const extra = indexedAgenda.filter((item) => !item.phaseId || !knownIds.has(item.phaseId));
    if (extra.length > 0) {
      groups.push({
        phase: {
          id: 'extra',
          number: '05',
          label: 'فقرات مضافة',
          title: 'فقرات إضافية للمنهاج',
          durationLabel: `${extra.length} فقرات`,
          durationMinutes: 0,
          timeRange: 'ضمن الحفل',
          theme: 'sky'
        },
        items: extra
      });
    }
    return groups;
  }, [phases, indexedAgenda]);

  const visibleGroups =
    selectedPhaseId === 'all'
      ? phaseGroups
      : phaseGroups.filter((g) => g.phase.id === selectedPhaseId);

  const totalMinutes = meta.totalMinutes || 115;
  const activeCueItem = indexedAgenda[activeCueIndex] || indexedAgenda[0];
  const nextCueItem = indexedAgenda[activeCueIndex + 1] || null;

  const handlePrintOfficialProgram = async () => {
    playClickPop();
    const { openOfficialAgendaPrintWindow } = await import('../utils/print/agendaPrint');
    openOfficialAgendaPrintWindow(agendaItems, phases, meta);
  };

  return (
    <section
      id="agenda"
      className="py-16 sm:py-24 relative z-10 border-y border-slate-200/70 dark:border-slate-800/80 transition-colors duration-300 overflow-hidden"
    >
      {/* Subtle Ambient Ceremonial Glow */}
      <div className="pointer-events-none absolute top-16 right-8 w-80 h-80 bg-sky-400/12 dark:bg-sky-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 left-8 w-80 h-80 bg-amber-400/12 dark:bg-amber-500/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-7">
        {/* ============================================================
            1. ROYAL DUAL-LOGO CEREMONIAL PROGRAM COVER HEADER
           ============================================================ */}
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#061530] via-[#0b2754] to-[#081b3b] text-white border-2 border-amber-400/55 shadow-[0_24px_60px_-15px_rgba(8,32,70,0.45)]">
          {/* Decorative Gold Trim Top Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-yellow-200 via-sky-400 to-amber-400" />

          {/* Ambient inner lights */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl" />

          <div className="relative z-10 p-5 sm:p-8 lg:p-10">
            {/* Dual Organizers Logos Bar (Matching the Official Document Header) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/15">
              {/* Right Logo: Abdaa Club */}
              <div className="flex items-center gap-3 bg-white/95 px-4 py-2.5 rounded-2xl shadow-lg border border-amber-300/60 min-w-[165px] justify-center">
                <img
                  src="/brand/abdaa-logo.png"
                  alt="نادي أبدع للمهارات الذكية"
                  className="h-11 sm:h-12 w-auto object-contain"
                />
                <div className="text-right">
                  <strong className="block text-xs font-black text-slate-900 font-alexandria leading-tight">
                    نادي أبدع
                  </strong>
                  <span className="block text-[10px] font-bold text-amber-700 leading-tight">
                    للمهارات الذكية
                  </span>
                </div>
              </div>

              {/* Center Royal Emblem with Official 1001 Initiative Logo */}
              <div className="text-center flex flex-col items-center">
                <img
                  src="/brand/logo-1001-kids.png"
                  alt="شعار مبادرة 1001 طفل رقمي"
                  className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_6px_16px_rgba(245,158,11,0.35)] mb-2"
                />
                <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-400/15 border border-amber-300/45 text-amber-300 text-xs font-extrabold font-alexandria mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{meta.forumTitle}</span>
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-alexandria text-white tracking-tight leading-snug">
                  {meta.programTitle}
                </h2>
              </div>

              {/* Left Logo: Masdar Tech */}
              <div className="flex items-center justify-center bg-white/95 px-4 py-3 rounded-2xl shadow-lg border border-sky-300/60 min-w-[165px]">
                <img
                  src="/brand/masdar-logo-full-clean.png"
                  alt="شركة مصدر لتكنولوجيا المعلومات وتطوير البرمجيات"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </div>
            </div>

            {/* Official Event Date, Venue & Organizers */}
            <div className="mt-5 text-center space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-sky-100">
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>المقام {meta.dateFull}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4 text-sky-300 shrink-0" />
                  <span>في {meta.venueFull}</span>
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-amber-200/95 font-bold">
                الجهات المنظمة: <span className="text-white">{meta.organizers}</span>
              </p>
            </div>

            {/* 4-Tile Official Timing Summary Strip */}
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 text-right">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-sky-200">الوصول والترحيب</span>
                  <DoorOpen className="w-4 h-4 text-amber-300" />
                </div>
                <strong className="text-base sm:text-lg font-black font-alexandria text-amber-300 block">
                  {meta.arrivalTime}
                </strong>
                <span className="text-[10.5px] text-slate-300">استقبال الضيوف والعوائل</span>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 text-right">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-sky-200">بدء فعاليات الحفل</span>
                  <Clock className="w-4 h-4 text-sky-300" />
                </div>
                <strong className="text-base sm:text-lg font-black font-alexandria text-white block">
                  {meta.startTime}
                </strong>
                <span className="text-[10.5px] text-slate-300">الافتتاح الرسمي والقرآن الكريم</span>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3.5 text-right">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-sky-200">وقت انتهاء الحفل</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                </div>
                <strong className="text-base sm:text-lg font-black font-alexandria text-emerald-300 block">
                  {meta.endTime}
                </strong>
                <span className="text-[10.5px] text-slate-300">الصورة التذكارية ومعرض الشركات</span>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 backdrop-blur-md border border-amber-300/40 p-3.5 text-right">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-amber-200">المدة الإجمالية</span>
                  <Timer className="w-4 h-4 text-amber-300" />
                </div>
                <strong className="text-base sm:text-lg font-black font-alexandria text-white block">
                  {meta.totalDuration}
                </strong>
                <span className="text-[10.5px] text-amber-200/90">
                  4 فترات رسمية • {indexedAgenda.length} فقرة
                </span>
              </div>
            </div>

            {/* Action Toolbar inside Ceremonial Header */}
            <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              {/* View Switcher: Luxury Booklet vs Official Protocol Table */}
              <div className="inline-flex items-center p-1 rounded-2xl bg-slate-950/60 border border-white/15 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    playClickPop();
                    setViewMode('timeline');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'timeline'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>المخطط التفصيلي</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickPop();
                    setViewMode('table');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <Table2 className="w-3.5 h-3.5" />
                  <span>الجدول البروتوكولي الرسمي</span>
                </button>
              </div>

              {/* Organizer Live Cue + Print Official A4 Booklet */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickPop();
                    setMcCueMode((prev) => !prev);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border transition cursor-pointer ${
                    mcCueMode
                      ? 'bg-rose-500 text-white border-rose-300 shadow-lg shadow-rose-500/30'
                      : 'bg-white/10 hover:bg-white/15 text-sky-100 border-white/20'
                  }`}
                >
                  <Radio className={`w-3.5 h-3.5 ${mcCueMode ? 'animate-pulse' : ''}`} />
                  <span>{mcCueMode ? 'إغلاق وضع عريف الحفل' : 'وضع متابعة عريف الحفل'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintOfficialProgram}
                  className="px-4 py-2 rounded-xl bg-gradient-to-l from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة المنهاج الرسمي (A4)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            2. OPTIONAL LIVE MC / STAGE DIRECTOR CUE CONSOLE
           ============================================================ */}
        {mcCueMode && activeCueItem && (
          <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-l from-slate-950 via-[#0d1f3c] to-slate-950 text-white border-2 border-rose-400/70 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 text-right">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/25 border border-rose-400/50 text-rose-200 text-[11px] font-black">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  الفقرة الجارية الآن ({activeCueIndex + 1} من {indexedAgenda.length})
                </span>
                <span className="text-xs font-black text-amber-300 inline-block" dir="ltr">
                  {activeCueItem.time}
                </span>
                {activeCueItem.duration && (
                  <span className="text-[11px] font-bold bg-white/10 px-2.5 py-0.5 rounded-full text-sky-200">
                    {activeCueItem.duration}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black font-alexandria text-white">
                {activeCueItem.title}
              </h3>
              {(activeCueItem.speaker || activeCueItem.description) && (
                <p className="text-xs text-sky-200 font-bold">
                  {activeCueItem.speaker || activeCueItem.description}
                </p>
              )}
              {nextCueItem && (
                <p className="text-[11px] text-amber-200/90 pt-1">
                  <strong>الفقرة التالية:</strong> {nextCueItem.title}{' '}
                  (<span dir="ltr" className="inline-block">{nextCueItem.time}</span>)
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                type="button"
                disabled={activeCueIndex <= 0}
                onClick={() => {
                  playClickPop();
                  setActiveCueIndex((i) => Math.max(0, i - 1));
                }}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-xs font-black flex items-center gap-1 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابقة</span>
              </button>
              <button
                type="button"
                disabled={activeCueIndex >= indexedAgenda.length - 1}
                onClick={() => {
                  playClickPop();
                  setActiveCueIndex((i) => Math.min(indexedAgenda.length - 1, i + 1));
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 text-xs font-black flex items-center gap-1 shadow transition cursor-pointer"
              >
                <span>الفقرة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            3. PROPORTIONAL 4-PHASE DURATION BAR & INTERACTIVE FILTER
           ============================================================ */}
        <div className="frosted-glass rounded-3xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-right">
              <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <strong className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-alexandria">
                توزيع فترات الحفل الأربع ({meta.totalDuration})
              </strong>
            </div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              اضغط على أي فترة للتركيز عليها أو استعرض المنهاج بالكامل
            </span>
          </div>

          {/* Visual Proportional Bar (23m | 32m | 55m | 5m) */}
          <div className="w-full h-3.5 rounded-full overflow-hidden flex gap-1 bg-slate-200/80 dark:bg-slate-800 p-0.5">
            {phases.map((phase) => {
              const style = PHASE_STYLES[phase.theme] || PHASE_STYLES.royal;
              const pct = Math.max(6, (phase.durationMinutes / totalMinutes) * 100);
              const isSelected = selectedPhaseId === 'all' || selectedPhaseId === phase.id;
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => {
                    playClickPop();
                    setSelectedPhaseId(selectedPhaseId === phase.id ? 'all' : phase.id);
                  }}
                  style={{ width: `${pct}%` }}
                  title={`${phase.label}: ${phase.title} (${phase.durationLabel})`}
                  className={`h-full rounded-full bg-gradient-to-l ${style.barSegment} transition-all duration-300 cursor-pointer ${
                    isSelected ? 'opacity-100 hover:brightness-110' : 'opacity-25 hover:opacity-60'
                  }`}
                />
              );
            })}
          </div>

          {/* Phase Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playClickPop();
                setSelectedPhaseId('all');
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black border transition-all cursor-pointer ${
                selectedPhaseId === 'all'
                  ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 border-slate-900 dark:border-amber-300 shadow-md'
                  : 'bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400'
              }`}
            >
              المنهاج الكامل ({indexedAgenda.length} فقرة)
            </button>

            {phases.map((phase) => {
              const style = PHASE_STYLES[phase.theme] || PHASE_STYLES.royal;
              const active = selectedPhaseId === phase.id;
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => {
                    playClickPop();
                    setSelectedPhaseId(active ? 'all' : phase.id);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    active ? style.activePill : `${style.pillBg} hover:scale-[1.02]`
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-80">{phase.number}</span>
                  <span>{phase.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                    {phase.durationLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            4. PRE-CEREMONY RECEPTION BANNER (2:00 ظهراً)
           ============================================================ */}
        {(selectedPhaseId === 'all' || selectedPhaseId === 'opening') && (
          <div className="rounded-3xl p-4 sm:p-5 bg-gradient-to-l from-amber-50 via-white to-sky-50 dark:from-amber-950/40 dark:via-slate-900 dark:to-sky-950/40 border-2 border-amber-300/80 dark:border-amber-600/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-right">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md shrink-0">
                <DoorOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 dark:text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ما قبل انطلاق المراسم الرسمية</span>
                </span>
                <h3 className="text-base sm:text-lg font-black font-alexandria text-slate-900 dark:text-white">
                  {meta.arrivalLabel}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  استقبال الشخصيات الرسمية والضيوف وعوائل الخريجين وتنظيم الدخول إلى قاعة قصر الثقافة تمهيداً لبدء الحفل في تمام الساعة 3:00 عصراً.
                </p>
              </div>
            </div>
            <span className="px-4 py-2 rounded-2xl bg-amber-400/20 dark:bg-amber-500/20 border border-amber-400/60 text-amber-900 dark:text-amber-200 font-alexandria font-black text-xs sm:text-sm whitespace-nowrap self-end sm:self-center inline-flex items-center gap-1.5">
              <bdi dir="ltr">2:00 – 3:00</bdi>
              <span>ظهراً</span>
            </span>
          </div>
        )}

        {/* ============================================================
            5A. LUXURY 4-PHASE TIMELINE BOOKLET VIEW
           ============================================================ */}
        {viewMode === 'timeline' ? (
          <div className="space-y-8">
            {visibleGroups.map(({ phase, items }) => {
              const style = PHASE_STYLES[phase.theme] || PHASE_STYLES.royal;

              return (
                <div
                  key={phase.id}
                  className={`rounded-[30px] overflow-hidden bg-white/80 dark:bg-slate-900/75 backdrop-blur-xl border ${style.border} shadow-[0_14px_40px_-15px_rgba(15,23,42,0.12)]`}
                >
                  {/* Phase Header Banner */}
                  <div className={`bg-gradient-to-l ${style.headerBg} text-white px-5 sm:px-7 py-4 relative overflow-hidden`}>
                    <div className={`absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r ${style.accentBar}`} />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 text-right">
                        <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center font-alexandria font-black text-base text-amber-300 shrink-0">
                          {phase.number}
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-amber-200/95 block leading-none mb-1">
                            {phase.label}
                          </span>
                          <h3 className="text-lg sm:text-xl font-black font-alexandria text-white leading-tight">
                            {phase.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-black text-white">
                          <Clock className="w-3.5 h-3.5 text-amber-300" />
                          <span dir="ltr" className="inline-block">
                            {String(phase.timeRange || '').replace(/\s*عصراً\s*/, '')}
                          </span>
                          {String(phase.timeRange || '').includes('عصراً') && <span>عصراً</span>}
                        </span>
                        {phase.durationLabel && (
                          <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-sm">
                            <Timer className="w-3.5 h-3.5" />
                            <span>{phase.durationLabel}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Phase Segments Timeline */}
                  <div className="p-4 sm:p-6">
                    <div className={`relative border-r-2 ${style.railColor} pr-5 sm:pr-7 mr-2 sm:mr-4 space-y-4`}>
                      {items.map((item) => {
                        const IconComp = ICON_MAP[item.iconType] || Clock;
                        const isCueActive = mcCueMode && activeCueIndex === item.globalIndex;
                        const isVip = Boolean(item.vip);
                        const isHighlight = Boolean(item.highlight);
                        const stepNum = String(item.globalIndex + 1).padStart(2, '0');

                        return (
                          <div
                            key={item.id || item.globalIndex}
                            onClick={() => {
                              if (mcCueMode) {
                                playClickPop();
                                setActiveCueIndex(item.globalIndex);
                              }
                            }}
                            className={`relative group ${mcCueMode ? 'cursor-pointer' : ''}`}
                          >
                            {/* Timeline Numbered Node */}
                            <div
                              className={`absolute -right-[33px] sm:-right-[43px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-slate-900 ring-4 flex items-center justify-center text-[10px] sm:text-[11px] font-black font-mono transition-transform duration-300 group-hover:scale-110 ${
                                isCueActive
                                  ? 'bg-rose-500 text-white ring-rose-200 dark:ring-rose-900 scale-115'
                                  : style.nodeBg
                              }`}
                            >
                              {stepNum}
                            </div>

                            {/* Segment Card */}
                            <div
                              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 text-right ${
                                isCueActive
                                  ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-400 ring-2 ring-rose-400/40 shadow-lg'
                                  : isVip
                                    ? 'bg-gradient-to-l from-amber-50/95 via-white to-sky-50/70 dark:from-amber-950/30 dark:via-slate-900 dark:to-sky-950/30 border-amber-300/90 dark:border-amber-600/60 shadow-md'
                                    : isHighlight
                                      ? 'bg-gradient-to-l from-sky-50/85 via-white to-amber-50/50 dark:from-slate-800/90 dark:via-slate-900 dark:to-slate-900 border-sky-300/80 dark:border-sky-700/70 shadow-sm'
                                      : 'bg-white/90 dark:bg-slate-900/85 border-slate-200/85 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                {/* Right Side: Icon + Title + Speaker */}
                                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                  <div
                                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                                      isVip
                                        ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-sm'
                                        : style.iconBox
                                    }`}
                                  >
                                    <IconComp className="w-5 h-5" />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                      {isVip && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                                          <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                          <span>كلمة رسمية رئيسية</span>
                                        </span>
                                      )}
                                      {!isVip && isHighlight && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                                          <span>فقرة محورية مميزة</span>
                                        </span>
                                      )}
                                      {isCueActive && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-600 text-white">
                                          <Radio className="w-3 h-3 animate-pulse" />
                                          <span>الآن على المسرح</span>
                                        </span>
                                      )}
                                    </div>

                                    <h4 className="text-sm sm:text-base font-black font-alexandria text-slate-900 dark:text-white leading-snug group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
                                      {item.title}
                                    </h4>

                                    {(item.speaker || item.description) && (
                                      <p className="mt-1.5 text-xs sm:text-[13px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {item.speaker || item.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Left Side: Exact Time Range & Duration Pill */}
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                                  <span
                                    className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl border font-alexandria whitespace-nowrap ${style.timeBadge}`}
                                  >
                                    <Clock className="w-3.5 h-3.5 opacity-80" />
                                    <span dir="ltr" className="inline-block">{item.time}</span>
                                  </span>
                                  {item.duration && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/90 px-2.5 py-0.5 rounded-lg whitespace-nowrap">
                                      <Timer className="w-3 h-3 text-amber-500" />
                                      <span>{item.duration}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ============================================================
             5B. OFFICIAL PROTOCOL TABLE VIEW (الجدول البروتوكولي الرسمي)
             ============================================================ */
          <div className="rounded-[28px] overflow-hidden bg-white dark:bg-slate-900 border-2 border-[#082046]/20 dark:border-slate-700 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[#082046] text-white text-xs sm:text-sm font-alexandria">
                    <th className="py-3.5 px-4 sm:px-6 font-black">الفقرة والمتحدث / الجهة</th>
                    <th className="py-3.5 px-3 sm:px-5 font-black text-center whitespace-nowrap w-28">المدة</th>
                    <th className="py-3.5 px-3 sm:px-5 font-black text-center whitespace-nowrap w-32">الوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleGroups.map(({ phase, items }) => {
                    const style = PHASE_STYLES[phase.theme] || PHASE_STYLES.royal;
                    return (
                      <React.Fragment key={phase.id}>
                        <tr className={`bg-gradient-to-l ${style.headerBg} text-white`}>
                          <td colSpan={3} className="py-3 px-4 sm:px-6 font-alexandria font-black text-xs sm:text-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span>
                                {phase.label} ({phase.title}) {phase.durationLabel ? `– ${phase.durationLabel}` : ''}
                              </span>
                              <span className="text-[11px] text-amber-300 font-bold inline-flex items-center gap-1">
                                <span dir="ltr" className="inline-block">
                                  {String(phase.timeRange || '').replace(/\s*عصراً\s*/, '')}
                                </span>
                                {String(phase.timeRange || '').includes('عصراً') && <span>عصراً</span>}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {items.map((item) => {
                          const isCueActive = mcCueMode && activeCueIndex === item.globalIndex;
                          return (
                            <tr
                              key={item.id || item.globalIndex}
                              onClick={() => {
                                if (mcCueMode) {
                                  playClickPop();
                                  setActiveCueIndex(item.globalIndex);
                                }
                              }}
                              className={`border-b border-slate-200/80 dark:border-slate-800 transition-colors ${
                                mcCueMode ? 'cursor-pointer' : ''
                              } ${
                                isCueActive
                                  ? 'bg-rose-50 dark:bg-rose-950/40'
                                  : item.vip
                                    ? 'bg-amber-50/70 dark:bg-amber-950/20'
                                    : item.highlight
                                      ? 'bg-sky-50/50 dark:bg-sky-950/20'
                                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              <td className="py-3.5 px-4 sm:px-6">
                                <div className="flex items-start gap-2.5">
                                  <span className="mt-0.5 text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                                    {String(item.globalIndex + 1).padStart(2, '0')}
                                  </span>
                                  <div>
                                    <div className="font-alexandria font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                                      {item.title}
                                    </div>
                                    {(item.speaker || item.description) && (
                                      <div className="text-[11.5px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                                        {item.speaker || item.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-3 sm:px-5 text-center whitespace-nowrap">
                                <span className="inline-block px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 text-xs font-extrabold">
                                  {item.duration || '—'}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 sm:px-5 text-center whitespace-nowrap">
                                <span
                                  dir="ltr"
                                  className="inline-block font-alexandria font-black text-xs sm:text-sm text-slate-900 dark:text-white"
                                >
                                  {item.time}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================
            6. CEREMONIAL CLOSING FOOTER RIBBON
           ============================================================ */}
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-l from-[#061530] via-[#0c2957] to-[#061530] text-white border border-amber-400/45 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs sm:text-sm font-black font-alexandria">
              <span className="text-amber-300">وقت انتهاء الحفل: {meta.endTime}</span>
              <span className="opacity-40">|</span>
              <span className="text-sky-200">المدة الإجمالية للحفل: {meta.totalDuration}</span>
              <span className="opacity-40">|</span>
              <span className="text-emerald-300">— اختتام الحفل —</span>
            </div>
            <p className="text-xs text-slate-300 flex items-center justify-center md:justify-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>
                قصر الثقافة – النجف الأشرف • يلي الختام التقاط الصورة التذكارية والتوجه لزيارة معرض الشركات وابتكارات الأطفال
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrintOfficialProgram}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition cursor-pointer shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>تحميل / طباعة المنهاج (A4)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
