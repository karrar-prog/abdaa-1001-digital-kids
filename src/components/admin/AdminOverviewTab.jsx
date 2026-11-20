import React, { useMemo } from 'react';
import {
  Ticket,
  Users,
  HeartHandshake,
  Award,
  CreditCard,
  MessageSquareHeart,
  Cloud,
  CloudOff,
  CheckCircle2,
  TrendingUp,
  Camera,
  Tv,
  Gift,
  Building2,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Bot
} from 'lucide-react';

function ProgressBarRow({ label, count, total, colorClass = 'from-sky-500 to-blue-600' }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[70%]">{label}</span>
        <span className="font-mono font-black text-slate-900 dark:text-white">
          {count} <span className="text-[10px] text-slate-400">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-l ${colorClass} transition-all duration-500`}
          style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
        />
      </div>
    </div>
  );
}

export default function AdminOverviewTab({
  cloudConnected,
  lastSyncedAt,
  tickets,
  batch2List,
  volunteers,
  sponsorsReq,
  evaluations,
  prideMessages,
  issuedIdCards,
  cohortsList,
  projectsList,
  mentorsList,
  allowedTabs,
  onSelectTab,
  onLaunchFieldTool
}) {
  const metrics = useMemo(() => {
    const totalTickets = tickets.length;
    const attendedTickets = tickets.filter((t) => t.is_attended).length;
    const attendanceRate = totalTickets > 0 ? Math.round((attendedTickets / totalTickets) * 100) : 0;
    const totalSeats = tickets.reduce((acc, t) => acc + (parseInt(t.companions_count, 10) || 1), 0);

    const avgEvalScore =
      evaluations.length > 0
        ? Math.round(
            evaluations.reduce((acc, e) => acc + Number(e.total_score ?? e.totalScore ?? 0), 0) /
              evaluations.length
          )
        : 0;

    const evaluatedProjectsCount = new Set(
      evaluations.map((e) => e.project_code || e.projectCode).filter(Boolean)
    ).size;

    const totalGraduates = (cohortsList || []).reduce(
      (sum, c) => sum + ((c.graduates || c.students || []).length),
      0
    );

    // Groupings
    const guestTypeCounts = {};
    tickets.forEach((t) => {
      const key = t.guest_type || 'ضيف عام';
      guestTypeCounts[key] = (guestTypeCounts[key] || 0) + 1;
    });

    const committeeCounts = {};
    volunteers.forEach((v) => {
      const key = v.committee || v.field_of_interest || 'لجنة عامة';
      committeeCounts[key] = (committeeCounts[key] || 0) + 1;
    });

    const batch2TrackCounts = {};
    const batch2StageCounts = {};
    batch2List.forEach((b) => {
      const tr = b.preferred_track || 'مسار عام';
      batch2TrackCounts[tr] = (batch2TrackCounts[tr] || 0) + 1;
      const st = b.age_stage || 'غير محدد';
      batch2StageCounts[st] = (batch2StageCounts[st] || 0) + 1;
    });

    // Top 5 Evaluated Projects
    const projScores = {};
    evaluations.forEach((ev) => {
      const code = ev.project_code || ev.projectCode;
      if (!code) return;
      if (!projScores[code]) {
        projScores[code] = {
          code,
          title: ev.project_title || ev.projectTitle || code,
          sum: 0,
          count: 0
        };
      }
      projScores[code].sum += Number(ev.total_score ?? ev.totalScore ?? 0);
      projScores[code].count += 1;
    });
    const topProjects = Object.values(projScores)
      .map((p) => ({ ...p, avg: Math.round(p.sum / p.count) }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);

    return {
      totalTickets,
      attendedTickets,
      attendanceRate,
      totalSeats,
      avgEvalScore,
      evaluatedProjectsCount,
      totalGraduates,
      guestTypes: Object.entries(guestTypeCounts).sort((a, b) => b[1] - a[1]),
      committees: Object.entries(committeeCounts).sort((a, b) => b[1] - a[1]),
      batch2Tracks: Object.entries(batch2TrackCounts).sort((a, b) => b[1] - a[1]),
      batch2Stages: Object.entries(batch2StageCounts).sort((a, b) => b[1] - a[1]),
      topProjects
    };
  }, [tickets, batch2List, volunteers, evaluations, cohortsList]);

  const kpiCards = [
    {
      label: 'حجوزات التذاكر والمقاعد',
      value: metrics.totalTickets,
      sub: `${metrics.attendedTickets} حاضر (${metrics.attendanceRate}%) • ${metrics.totalSeats} مقعداً`,
      icon: Ticket,
      gradient: 'from-sky-500 to-blue-600',
      tab: 'tickets'
    },
    {
      label: 'مرشحو الدفعة الثانية',
      value: batch2List.length,
      sub: 'أطفال مسجلون للأعمار (7 – 14 سنة)',
      icon: Users,
      gradient: 'from-amber-500 to-orange-600',
      tab: 'batch2'
    },
    {
      label: 'فريق المتطوعين واللجان',
      value: volunteers.length,
      sub: `${metrics.committees.length} لجنة تنظيمية نشطة`,
      icon: HeartHandshake,
      gradient: 'from-teal-500 to-emerald-600',
      tab: 'volunteers'
    },
    {
      label: 'تقييمات لجنة التحكيم',
      value: evaluations.length,
      sub: `${metrics.evaluatedProjectsCount} مشروع مقيّم • معدل ${metrics.avgEvalScore}/100`,
      icon: Award,
      gradient: 'from-indigo-500 to-purple-600',
      tab: 'evaluations'
    },
    {
      label: 'الهويات الصادرة والأرشيف',
      value: issuedIdCards.length,
      sub: 'هويات رسمية بـ QR محفوظة سحابياً',
      icon: CreditCard,
      gradient: 'from-cyan-600 to-sky-700',
      tab: 'id_cards'
    },
    {
      label: 'جدار الفخر وطلبات الرعاية',
      value: prideMessages.length + sponsorsReq.length,
      sub: `${prideMessages.length} تهنئة • ${sponsorsReq.length} طلب رعاية`,
      icon: MessageSquareHeart,
      gradient: 'from-rose-500 to-pink-600',
      tab: 'community'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Cloud Status Hero Strip */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-l from-slate-900 via-sky-950 to-indigo-950 text-white border border-sky-500/30 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border ${
                cloudConnected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
              }`}
            >
              {cloudConnected ? <Cloud className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5" />}
              <span>
                {cloudConnected
                  ? 'متصل ومزامن سحابياً بالكامل مع Supabase ⚡'
                  : 'وضع العمل المحلي (لم يتم تأكيد المزامنة السحابية)'}
              </span>
            </span>
            {lastSyncedAt && (
              <span className="text-[11px] text-slate-300 font-mono">
                آخر تحديث: {lastSyncedAt}
              </span>
            )}
          </div>
          <h3 className="font-alexandria font-black text-lg sm:text-2xl text-white">
            المركز التنفيذي الشامل — مبادرة «1001» طفل رقمي
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl">
            جميع التعديلات على المحتوى والمدربين والخريجين والمعرض والتقييمات والهويات واليوزرات تُحفظ سحابياً وتنعكس فوراً لكافة الزوار والأجهزة.
          </p>
        </div>

        {/* Content Summary Pills */}
        <div className="grid grid-cols-3 gap-2.5 shrink-0">
          <div className="px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
            <GraduationCap className="w-4 h-4 text-amber-300 mx-auto mb-1" />
            <div className="text-base font-black font-alexandria">{metrics.totalGraduates}</div>
            <div className="text-[10px] text-slate-300">خريج مسجل</div>
          </div>
          <div className="px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
            <Bot className="w-4 h-4 text-sky-300 mx-auto mb-1" />
            <div className="text-base font-black font-alexandria">{projectsList.length}</div>
            <div className="text-[10px] text-slate-300">مشروع علمي</div>
          </div>
          <div className="px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
            <Sparkles className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
            <div className="text-base font-black font-alexandria">{mentorsList.length}</div>
            <div className="text-[10px] text-slate-300">مؤسس ومدرب</div>
          </div>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const canOpen = allowedTabs.includes(card.tab);
          return (
            <button
              key={card.label}
              type="button"
              disabled={!canOpen}
              onClick={() => canOpen && onSelectTab(card.tab)}
              className={`text-right p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex items-start justify-between gap-4 ${
                canOpen
                  ? 'hover:-translate-y-0.5 hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-lg cursor-pointer group'
                  : 'opacity-80 cursor-default'
              }`}
            >
              <div className="space-y-1.5 min-w-0">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 block">
                  {card.label}
                </span>
                <div className="text-3xl font-black font-alexandria text-slate-900 dark:text-white">
                  {card.value}
                </div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
                  {card.sub}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between h-full gap-3 shrink-0">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} text-white flex items-center justify-center shadow-md`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                {canOpen && (
                  <span className="text-[10px] font-black text-sky-600 dark:text-sky-400 inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    <span>عرض</span>
                    <ArrowLeft className="w-3 h-3" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Field Operations Launchers */}
      {onLaunchFieldTool && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'scanner', label: 'ماسح QR بالكاميرا', sub: 'تسجيل دخول الضيوف', icon: Camera, color: 'from-emerald-600 to-teal-700' },
            { id: 'stage', label: 'شاشة المسرح LED', sub: 'عرض تكريم الخريجين', icon: Tv, color: 'from-amber-500 to-orange-600' },
            { id: 'judging', label: 'بوابة التحكيم', sub: 'تقييم المشاريع والترتيب', icon: Award, color: 'from-indigo-600 to-purple-700' },
            { id: 'raffle', label: 'منصة القرعة الحية', sub: 'السحب العشوائي المباشر', icon: Gift, color: 'from-rose-500 to-pink-600' }
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onLaunchFieldTool(tool.id)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 transition flex items-center gap-3 text-right shadow-xs cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center shrink-0 shadow`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition truncate">
                    {tool.label}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{tool.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Analytics & Visual Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Attendance & Guest Types */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-alexandria font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>مؤشر حضور القاعة وتوزيع فئات التذاكر</span>
            </h4>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-black">
              {metrics.attendanceRate}% تم تحضيرهم
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-600 dark:text-slate-300">
                نسبة تسجيل الدخول الفعلي عبر بوابة الاستقبال
              </span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                {metrics.attendedTickets} / {metrics.totalTickets}
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-teal-500 transition-all duration-700"
                style={{ width: `${metrics.attendanceRate}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {metrics.guestTypes.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">لا توجد حجوزات تذاكر مسجلة بعد.</p>
            ) : (
              metrics.guestTypes.slice(0, 5).map(([type, count]) => (
                <ProgressBarRow
                  key={type}
                  label={type}
                  count={count}
                  total={metrics.totalTickets}
                  colorClass="from-sky-500 to-indigo-600"
                />
              ))
            )}
          </div>
        </div>

        {/* 2. Batch 2 Tracks & Age Stages */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-alexandria font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>توزيع مسجلي الدفعة الثانية حسب المسار المفضل</span>
            </h4>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-black">
              {batch2List.length} طفل
            </span>
          </div>

          <div className="space-y-3">
            {metrics.batch2Tracks.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">لا يوجد مسجلون للدفعة الثانية بعد.</p>
            ) : (
              metrics.batch2Tracks.slice(0, 5).map(([track, count]) => (
                <ProgressBarRow
                  key={track}
                  label={track}
                  count={count}
                  total={batch2List.length}
                  colorClass="from-amber-400 to-orange-500"
                />
              ))
            )}
          </div>

          {metrics.batch2Stages.length > 0 && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {metrics.batch2Stages.map(([stage, count]) => (
                <div
                  key={stage}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700 text-center"
                >
                  <div className="text-sm font-black font-alexandria text-sky-600 dark:text-sky-400">{count}</div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 line-clamp-1">{stage}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Volunteer Committees Distribution */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-alexandria font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-teal-500" />
              <span>توزيع المتطوعين على اللجان التنظيمية</span>
            </h4>
            <span className="px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[11px] font-black">
              {volunteers.length} متطوع
            </span>
          </div>

          <div className="space-y-3">
            {metrics.committees.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">لا يوجد متطوعون مسجلون حالياً.</p>
            ) : (
              metrics.committees.slice(0, 6).map(([committee, count]) => (
                <ProgressBarRow
                  key={committee}
                  label={committee}
                  count={count}
                  total={volunteers.length}
                  colorClass="from-teal-500 to-emerald-600"
                />
              ))
            )}
          </div>
        </div>

        {/* 4. Top Evaluated Projects & Recent Activity */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-alexandria font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" />
              <span>صدارة المشاريع المقيّمة (لجنة التحكيم)</span>
            </h4>
            <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-black">
              {evaluations.length} تقييم
            </span>
          </div>

          {metrics.topProjects.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <p className="text-xs text-slate-400 font-bold">لم تُسجّل تقييمات تحكيم سحابية بعد.</p>
              {onLaunchFieldTool && (
                <button
                  type="button"
                  onClick={() => onLaunchFieldTool('judging')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition cursor-pointer"
                >
                  فتح بوابة لجنة التحكيم
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {metrics.topProjects.map((p, idx) => (
                <div
                  key={p.code}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900 dark:text-white truncate">{p.title}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {p.code} • {p.count} محكّم
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs shrink-0">
                    {p.avg} / 100
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Sponsors Quick Counter */}
          {sponsorsReq.length > 0 && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>آخر طلب رعاية: {sponsorsReq[0]?.organization_name}</span>
              </span>
              {allowedTabs.includes('community') && (
                <button
                  type="button"
                  onClick={() => onSelectTab('community')}
                  className="text-sky-600 dark:text-sky-400 font-black hover:underline cursor-pointer"
                >
                  مراجعة الطلبات
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
