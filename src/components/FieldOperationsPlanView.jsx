import React, { useState, useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  Printer,
  Search,
  Clock,
  CheckCircle2,
  MapPin,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  Eye
} from 'lucide-react';
import { EVENT_DETAILS, getActiveCohorts, getActiveProjects } from '../data/eventData';
import { HONOROLL_MENTORS } from '../data/mentorsData';
import { playClickPop } from '../utils/soundEffects';
import {
  OPERATIONAL_TIMELINE_MATRIX,
  BOOTH_SECURITY_PROTOCOL,
  buildFieldOperationsGroups,
  loadFieldPlanAssignments,
  saveFieldPlanAssignments
} from '../utils/fieldOperationsPlan';
import { openFieldOperationsPrintWindow } from '../utils/print/fieldOperationsPrint';

export default function FieldOperationsPlanView({ meta = {}, volunteers = [] }) {
  const [groupTrackFilter, setGroupTrackFilter] = useState('all'); // 'all' | 'booths' | 'hall'
  const [hallGroupSize, setHallGroupSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSupervisors, setSavedSupervisors] = useState(() => loadFieldPlanAssignments());

  const cohorts = useMemo(() => getActiveCohorts(), []);
  const projects = useMemo(() => getActiveProjects(), []);

  const planData = useMemo(
    () =>
      buildFieldOperationsGroups({
        cohorts,
        projects,
        mentors: HONOROLL_MENTORS,
        volunteers,
        boothGroupSize: 5,
        hallGroupSize,
        savedSupervisors
      }),
    [cohorts, projects, volunteers, hallGroupSize, savedSupervisors]
  );

  const handleSupervisorChange = (groupId, value) => {
    setSavedSupervisors((prev) => {
      const next = { ...prev, [groupId]: value };
      saveFieldPlanAssignments(next);
      return next;
    });
  };

  const handleResetAssignments = () => {
    playClickPop();
    setSavedSupervisors({});
    saveFieldPlanAssignments({});
  };

  const q = searchQuery.trim().toLowerCase();
  const filterGroups = (groups) => {
    if (!q) return groups;
    return groups.filter(
      (g) =>
        String(g.title || '').toLowerCase().includes(q) ||
        String(g.code || '').toLowerCase().includes(q) ||
        String(g.supervisorName || '').toLowerCase().includes(q) ||
        String(g.rangeLabel || '').toLowerCase().includes(q) ||
        g.members.some(
          (m) =>
            String(m.name || '').toLowerCase().includes(q) ||
            String(m.projectTitle || m.project || '').toLowerCase().includes(q) ||
            String(m.boothLabel || '').toLowerCase().includes(q)
        )
    );
  };

  const visibleBoothGroups = useMemo(
    () => (groupTrackFilter === 'hall' ? [] : filterGroups(planData.boothGroups)),
    [planData.boothGroups, groupTrackFilter, q]
  );

  const visibleHallGroups = useMemo(
    () => (groupTrackFilter === 'booths' ? [] : filterGroups(planData.hallGroups)),
    [planData.hallGroups, groupTrackFilter, q]
  );

  const handlePrint = (section = 'all', directPrint = true) => {
    playClickPop();
    openFieldOperationsPrintWindow(planData, { ...(EVENT_DETAILS.agendaMeta || {}), ...meta }, { section, directPrint });
  };

  return (
    <div className="space-y-6 text-right">
      {/* Executive Field Operations Header & Print Controls */}
      <div className="rounded-[28px] p-5 sm:p-6 bg-gradient-to-l from-[#00185C] via-[#003194] to-[#00185C] text-white border-2 border-amber-400/60 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/60 text-amber-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-amber-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>الخطة الميدانية المعتمدة ليوم الحفل — كل 5 أطفال مع مدرب أو متطوع</span>
              </span>
              <h3 className="text-lg sm:text-xl font-black font-alexandria text-white">
                توزيع مجموعات الأطفال (أصحاب البوثات + القاعة) وبروتوكول تأمين وحراسة البوثات
              </h3>
              <p className="text-xs text-sky-100/90 mt-1">
                وصول فخامة الرئيس 3:00 عصراً ← الصورة الجماعية ← تفريع فوري (البوثات / القاعة) ← جولة المعرض 3:10 ← جولة المتحف 3:20 (سحب أصحاب البوثات للقاعة) ← انطلاق القاعة 3:30 عصراً.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handlePrint('all', true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-l from-amber-400 to-orange-400 hover:brightness-105 text-slate-950 text-xs font-alexandria font-black inline-flex items-center gap-1.5 shadow-md cursor-pointer transition"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الخطة الكاملة (A4)</span>
            </button>
            <button
              type="button"
              onClick={() => handlePrint('booths', true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-200 border border-amber-300/40 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>كشف البوثات فقط</span>
            </button>
            <button
              type="button"
              onClick={() => handlePrint('all', false)}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
              title="معاينة كاملة لملف الطباعة في نافذة مستقلة"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة A4</span>
            </button>
          </div>
        </div>

        {/* 4 Operational KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/15">
          <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5">
            <span className="text-[11px] font-bold text-sky-200 block">إجمالي الأطفال الخريجين</span>
            <strong className="text-xl font-black font-alexandria text-white block mt-0.5">
              {planData.totalKids} طفلاً
            </strong>
            <span className="text-[10.5px] text-slate-300">مقسّمون بالكامل على متابعين</span>
          </div>
          <div className="rounded-2xl bg-orange-500/20 border border-orange-300/50 p-3.5">
            <span className="text-[11px] font-bold text-orange-200 block">المسار (أ): أصحاب البوثات</span>
            <strong className="text-xl font-black font-alexandria text-amber-300 block mt-0.5">
              {planData.boothKidsCount} طفلاً ({planData.boothGroups.length} مجموعة)
            </strong>
            <span className="text-[10.5px] text-orange-100">كل 5 أطفال مع مدرب/متطوع بوثات</span>
          </div>
          <div className="rounded-2xl bg-sky-500/20 border border-sky-300/40 p-3.5">
            <span className="text-[11px] font-bold text-sky-200 block">المسار (ب): أطفال القاعة</span>
            <strong className="text-xl font-black font-alexandria text-white block mt-0.5">
              {planData.hallKidsCount} طفلاً ({planData.hallGroups.length} مجموعة)
            </strong>
            <span className="text-[10.5px] text-sky-100">كل {hallGroupSize} أطفال مع متطوع مرافقة</span>
          </div>
          <div className="rounded-2xl bg-emerald-500/20 border border-emerald-300/40 p-3.5">
            <span className="text-[11px] font-bold text-emerald-200 block">حراسة البوثات والمنسقون</span>
            <strong className="text-xl font-black font-alexandria text-emerald-300 block mt-0.5">
              {planData.boothSecurityCount} حراس + {planData.boothGroups.length + planData.hallGroups.length} متابعاً
            </strong>
            <span className="text-[10.5px] text-emerald-100">إجمالي الكادر الميداني: {planData.totalSupervisorsNeeded}</span>
          </div>
        </div>
      </div>

      {/* 1. Synchronized Parallel Run-of-Show Table */}
      <div className="rounded-[28px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="bg-gradient-to-l from-[#00185C] to-[#0038A8] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-300 shrink-0" />
            <h4 className="font-alexandria font-black text-sm !text-white">
              1. جدول التزامن الميداني المتوازي (حركة الوفد × البوثات × القاعة × الحراسة)
            </h4>
          </div>
          <span className="text-[11px] font-bold text-amber-200">
            نافذة سحب أصحاب البوثات للقاعة: 3:20 – 3:30 عصراً (وقت جولة المتحف)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-alexandria">
                <th className="py-3 px-3 font-black whitespace-nowrap">الوقت</th>
                <th className="py-3 px-3 font-black whitespace-nowrap">المرحلة</th>
                <th className="py-3 px-3 font-black">الوفد الرئاسي</th>
                <th className="py-3 px-3 font-black text-orange-800 dark:text-orange-300">أصحاب البوثات (5/متابع)</th>
                <th className="py-3 px-3 font-black text-sky-800 dark:text-sky-300">أطفال القاعة ({hallGroupSize}/متابع)</th>
                <th className="py-3 px-3 font-black text-emerald-800 dark:text-emerald-300">تأمين وحراسة البوثات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {OPERATIONAL_TIMELINE_MATRIX.map((row, idx) => {
                const isKeyWindow = idx === 2 || idx === 5;
                return (
                  <tr
                    key={row.id}
                    className={
                      isKeyWindow
                        ? 'bg-amber-50/80 dark:bg-amber-950/25'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }
                  >
                    <td className="py-3 px-3 font-black text-sky-800 dark:text-sky-300 whitespace-nowrap">
                      <span dir="ltr" className="inline-block">
                        {row.time}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-alexandria font-black text-slate-900 dark:text-white">
                      {row.stage}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 leading-relaxed">{row.vipFlow}</td>
                    <td className="py-3 px-3 font-bold text-orange-950 dark:text-orange-200 leading-relaxed">
                      {row.boothKidsFlow}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 leading-relaxed">{row.hallKidsFlow}</td>
                    <td className="py-3 px-3 text-emerald-900 dark:text-emerald-300 leading-relaxed">
                      {row.securityFlow}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Booth Equipment Security & Guard Protocol */}
      <div className="rounded-[28px] p-5 sm:p-6 bg-gradient-to-l from-orange-50/90 via-white to-amber-50/70 dark:from-orange-950/30 dark:via-slate-900 dark:to-amber-950/20 border-2 border-orange-300/80 dark:border-orange-700/60 shadow-sm space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
                2. بروتوكول التجهيز المسبق وحراسة البوثات وتأمين الأجهزة
              </h4>
              <p className="text-[11px] font-bold text-orange-800 dark:text-orange-300">
                يُسلّم لفريق حراسة المعرض (3–4 متطوعين) لضمان حماية اللابتوبات والروبوتات قبل الصورة وأثناء الحفل داخل القاعة
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {BOOTH_SECURITY_PROTOCOL.map((rule, idx) => (
            <div
              key={rule.id}
              className="rounded-2xl p-3.5 bg-white dark:bg-slate-900/90 border border-orange-200/80 dark:border-slate-800 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <strong className="text-xs font-alexandria font-black text-slate-900 dark:text-white">
                  {rule.title}
                </strong>
              </div>
              <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">{rule.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive 5-Kids-per-Volunteer Group Roster Controls & Editable Cards */}
      <div className="rounded-[28px] p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              <span>3. كشوف توزيع الأطفال على المدربين والمتطوعين (جاهزة للتعديل والطباعة)</span>
            </h4>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              يمكنك كتابة اسم المتطوع المسؤول داخل كل مجموعة الآن (يُحفظ تلقائياً في المتصفح ويظهر مباشرة في ورق الطباعة A4).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">حجم مجموعات القاعة:</span>
            {[5, 8, 10].map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => {
                  playClickPop();
                  setHallGroupSize(sz);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-black border cursor-pointer transition ${
                  hallGroupSize === sz
                    ? 'bg-[#00185C] text-amber-300 border-amber-400'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                كل {sz} {sz === 5 ? '(المعتمد)' : ''}
              </button>
            ))}
            {Object.keys(savedSupervisors).length > 0 && (
              <button
                type="button"
                onClick={handleResetAssignments}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                title="إعادة أسماء المتابعين المقترحة تلقائياً"
              >
                <RotateCcw className="w-3 h-3" />
                <span>افتراضي</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills + Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                playClickPop();
                setGroupTrackFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
                groupTrackFilter === 'all'
                  ? 'bg-[#00185C] text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              الكل ({planData.boothGroups.length + planData.hallGroups.length} مجموعة)
            </button>
            <button
              type="button"
              onClick={() => {
                playClickPop();
                setGroupTrackFilter('booths');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
                groupTrackFilter === 'booths'
                  ? 'bg-orange-500 text-white'
                  : 'bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
              }`}
            >
              أصحاب البوثات ({planData.boothGroups.length} مجموعة • كل 5/متابع)
            </button>
            <button
              type="button"
              onClick={() => {
                playClickPop();
                setGroupTrackFilter('hall');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
                groupTrackFilter === 'hall'
                  ? 'bg-sky-600 text-white'
                  : 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
              }`}
            >
              أطفال القاعة ({planData.hallGroups.length} مجموعة • كل {hallGroupSize}/متابع)
            </button>
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الطفل أو البوث أو المتطوع..."
              className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Booth Groups Grid */}
        {visibleBoothGroups.length > 0 && (
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
              <span className="text-xs font-alexandria font-black text-orange-950 dark:text-orange-200">
                المسار (أ): مجموعات أصحاب البوثات ({visibleBoothGroups.length} مجموعة — كل 5 أطفال مع مدرب/متطوع)
              </span>
              <span className="text-[11px] font-bold text-orange-700 dark:text-orange-300">
                إشارة سحب الأطفال للقاعة: 3:20 عصراً أثناء جولة المتحف
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {visibleBoothGroups.map((grp) => (
                <div
                  key={grp.groupId}
                  className="rounded-2xl border-2 border-orange-200/90 dark:border-orange-800/70 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
                >
                  <div className="bg-gradient-to-l from-[#00185C] to-orange-600 text-white px-4 py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-300 text-slate-950 font-mono text-[10px] font-black">
                        {grp.code}
                      </span>
                      <strong className="text-xs font-alexandria font-black">{grp.title}</strong>
                    </div>
                    <span className="text-[11px] font-bold text-amber-200">{grp.rangeLabel}</span>
                  </div>

                  <div className="p-3.5 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-slate-50 dark:bg-slate-800/70 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        المشرف / المتطوع:
                      </label>
                      <input
                        type="text"
                        value={grp.supervisorName}
                        onChange={(e) => handleSupervisorChange(grp.groupId, e.target.value)}
                        placeholder="اكتب اسم المدرب أو المتطوع المسؤول..."
                        className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-400"
                      />
                    </div>

                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{grp.hallZone}</span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                      {grp.members.map((m, mIdx) => (
                        <div
                          key={m.id}
                          className="px-2.5 py-1.5 flex items-center justify-between gap-2 text-xs bg-white dark:bg-slate-900"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 text-[10px] font-black flex items-center justify-center shrink-0">
                              {mIdx + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 dark:text-white truncate">{m.name}</div>
                              <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                                {m.projectTitle}
                              </div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-[10px] font-black whitespace-nowrap shrink-0">
                            {m.boothLabel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hall Groups Grid */}
        {visibleHallGroups.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800">
              <span className="text-xs font-alexandria font-black text-sky-950 dark:text-sky-200">
                المسار (ب): مجموعات أطفال القاعة ({visibleHallGroups.length} مجموعة — كل {hallGroupSize} أطفال مع متطوع)
              </span>
              <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                التوجه مباشرة للقاعة بعد الصورة الجماعية: 3:06 عصراً
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {visibleHallGroups.map((grp) => (
                <div
                  key={grp.groupId}
                  className="rounded-2xl border border-sky-200/90 dark:border-sky-800/70 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
                >
                  <div className="bg-gradient-to-l from-[#00185C] to-sky-700 text-white px-4 py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-300 text-slate-950 font-mono text-[10px] font-black">
                        {grp.code}
                      </span>
                      <strong className="text-xs font-alexandria font-black">{grp.title}</strong>
                    </div>
                    <span className="text-[11px] font-bold text-sky-200">{grp.members.length} أطفال</span>
                  </div>

                  <div className="p-3.5 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-slate-50 dark:bg-slate-800/70 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        المتطوع المتابع:
                      </label>
                      <input
                        type="text"
                        value={grp.supervisorName}
                        onChange={(e) => handleSupervisorChange(grp.groupId, e.target.value)}
                        placeholder="اكتب اسم المتطوع المسؤول عن المجموعة..."
                        className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>{grp.hallZone}</span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                      {grp.members.map((m, mIdx) => (
                        <div
                          key={m.id}
                          className="px-2.5 py-1.5 flex items-center justify-between gap-2 text-xs bg-white dark:bg-slate-900"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[10px] font-black flex items-center justify-center shrink-0">
                              {mIdx + 1}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white truncate">{m.name}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
                            {m.cohortName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
