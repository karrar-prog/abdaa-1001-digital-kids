import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  Lock,
  Unlock,
  Sliders,
  Trophy,
  Search,
  UserCheck,
  BarChart3,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EVENT_DETAILS } from '../data/eventData';
import { EventDB } from '../lib/supabase';

const CRITERIA_CONFIG = [
  { key: 'originality', label: '1. الأصالة وإبداع الفكرة الابتكارية', max: 25, defaultVal: 23 },
  { key: 'technicalBuild', label: '2. جودة البناء البرمجي والهندسي (حسب الفئة 7–14)', max: 25, defaultVal: 23 },
  { key: 'socialImpact', label: '3. الأثر المجتمعي وحل المشكلة الواقعية', max: 20, defaultVal: 18 },
  { key: 'livePrototype', label: '4. كفاءة عمل النموذج الأولي الحي في الجناح', max: 15, defaultVal: 14 },
  { key: 'presentation', label: '5. مهارات العرض والثقة والحوار العلمي للطفل', max: 15, defaultVal: 14 }
];

export default function JudgingPortalModal({ isOpen, onClose, initialProject = null }) {
  const [activeTab, setActiveTab] = useState(initialProject ? 'evaluate' : 'leaderboard');
  const [isJudgeUnlocked, setIsJudgeUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [judgeName, setJudgeName] = useState('د. حيدر الموسوي');
  const [judgeRole, setJudgeRole] = useState('عضو اللجنة العلمية – نقابة المبرمجين');
  const [selectedProjectCode, setSelectedProjectCode] = useState(
    initialProject?.code || EVENT_DETAILS.projectsSample[0]?.code || 'ABD-PRJ-01'
  );
  const [scores, setScores] = useState({
    originality: 24,
    technicalBuild: 24,
    socialImpact: 19,
    livePrototype: 14,
    presentation: 15
  });
  const [notes, setNotes] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [ageFilter, setAgeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      EventDB.getAllProjectEvaluations().then(setEvaluations);
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialProject?.code) {
      setSelectedProjectCode(initialProject.code);
      setActiveTab('evaluate');
    }
  }, [initialProject]);

  const totalScore = useMemo(() => {
    return (
      Number(scores.originality) +
      Number(scores.technicalBuild) +
      Number(scores.socialImpact) +
      Number(scores.livePrototype) +
      Number(scores.presentation)
    );
  }, [scores]);

  // Merge official 40 projects with live judge evaluations
  const rankedProjects = useMemo(() => {
    const list = EVENT_DETAILS.projectsSample.map((proj) => {
      const projEvals = evaluations.filter((ev) => ev.project_code === proj.code);
      const avgJudgeScore =
        projEvals.length > 0
          ? Math.round(projEvals.reduce((acc, cur) => acc + Number(cur.total_score || 0), 0) / projEvals.length)
          : proj.score || 92;
      return {
        ...proj,
        computedScore: avgJudgeScore,
        evalCount: projEvals.length
      };
    });

    return list
      .filter((p) => (ageFilter === 'ALL' ? true : p.ageGroup === ageFilter))
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.trim();
        return (
          p.title.includes(q) ||
          p.code.toLowerCase().includes(q.toLowerCase()) ||
          p.students.includes(q)
        );
      })
      .sort((a, b) => b.computedScore - a.computedScore || b.votes - a.votes);
  }, [evaluations, ageFilter, searchQuery]);

  if (!isOpen) return null;

  const selectedProject =
    EVENT_DETAILS.projectsSample.find((p) => p.code === selectedProjectCode) ||
    EVENT_DETAILS.projectsSample[0];

  const handleUnlockPin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === '1001' || pinInput.trim() === '2026') {
      setIsJudgeUnlocked(true);
      setPinError('');
    } else {
      setPinError('رمز الدخول غير صحيح. جرب الرمز المعتمد للجنة: 1001');
    }
  };

  const handleSaveEvaluation = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    await EventDB.saveProjectEvaluation({
      projectCode: selectedProject.code,
      projectTitle: selectedProject.title,
      ageGroup: selectedProject.ageLabel,
      judgeName,
      judgeRole,
      criteria: scores,
      totalScore,
      notes
    });

    const updated = await EventDB.getAllProjectEvaluations();
    setEvaluations(updated);
    setSavedToast(true);
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 } });
    setTimeout(() => setSavedToast(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-l from-slate-950 via-indigo-950 to-slate-900 text-white px-6 py-5 border-b-2 border-amber-400 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                  منظومة التحكيم الأكاديمي • 100 درجة
                </span>
                <span className="text-xs text-sky-300 font-bold">40 جناحاً ابتكارياً (أعمار 7 – 14 سنة)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black mt-0.5">
                بوابة التحكيم العلمي ولوحة الصدارة للمشاريع الـ 40
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>لوحة الصدارة الحية (40 مشروعاً)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('evaluate')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                activeTab === 'evaluate'
                  ? 'bg-sky-500 text-white shadow'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>استمارة المحكم الميداني</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'leaderboard' ? (
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'ALL', label: 'جميع الفئات (40 مشروعاً)' },
                    { id: '7-9', label: 'فئة 7 – 9 سنوات' },
                    { id: '10-11', label: 'فئة 10 – 11 سنة' },
                    { id: '12-14', label: 'فئة 12 – 14 سنة' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setAgeFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                        ageFilter === f.id
                          ? 'bg-slate-900 text-amber-300 shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث باسم المشروع أو الكود..."
                    className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white outline-none"
                  />
                </div>
              </div>

              {/* Leaderboard List */}
              <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
                {rankedProjects.map((proj, idx) => (
                  <div
                    key={proj.code}
                    className={`p-3.5 rounded-2xl border transition flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 ${
                      idx < 3
                        ? 'bg-gradient-to-l from-amber-50/80 via-white to-sky-50/50 border-amber-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                          idx === 0
                            ? 'bg-amber-400 text-slate-950 shadow'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-900'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                            {proj.code}
                          </span>
                          <span className="text-[11px] font-extrabold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                            {proj.ageLabel}
                          </span>
                          {proj.evalCount > 0 && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              ✓ تم تحكيمه ميدانياً ({proj.evalCount})
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-sm text-slate-900 mt-1">{proj.title}</h4>
                        <p className="text-xs text-slate-500">{proj.students}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mr-auto sm:mr-0">
                      <div className="text-left">
                        <div className="text-lg font-black text-slate-900">
                          {proj.computedScore} <span className="text-xs text-slate-400">/ 100</span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-500">درجة اللجنة العلمية</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProjectCode(proj.code);
                          setActiveTab('evaluate');
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-sky-700 text-white text-xs font-extrabold transition"
                      >
                        تحكيم الجناح
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !isJudgeUnlocked ? (
            /* Judge PIN Gate */
            <div className="max-w-md mx-auto my-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-black text-slate-900">بوابة أعضاء اللجنة العلمية والمحكمين</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                يرجى إدخال رمز التحكيم الميداني المخصص للجنة تقييم معارض أجنحة الأطفال (الأعمار 7 – 14 سنة) في قصر الثقافة.
              </p>

              <form onSubmit={handleUnlockPin} className="space-y-3">
                <input
                  type="password"
                  dir="ltr"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="أدخل رمز اللجنة (1001)"
                  className="w-full text-center tracking-widest font-mono text-lg font-black py-3 px-4 rounded-2xl border-2 border-slate-300 focus:border-sky-600 outline-none bg-white"
                />
                {pinError && (
                  <div className="text-xs font-bold text-rose-600 flex items-center justify-center gap-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{pinError}</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-sky-700 text-white font-black text-sm flex items-center justify-center gap-2 transition"
                >
                  <Unlock className="w-4 h-4 text-amber-400" />
                  <span>فتح استمارة التقييم الميداني</span>
                </button>
              </form>

              <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                💡 رمز المحكمين المعتمد للتجربة والمعاينة الفورية: <strong className="font-mono text-sky-700">1001</strong>
              </div>
            </div>
          ) : (
            /* Judge Evaluation Form */
            <form onSubmit={handleSaveEvaluation} className="space-y-5">
              {savedToast && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>تم اعتماد الدرجة العلمية ({totalScore} / 100) وتحديث لوحة الصدارة بنجاح!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('leaderboard')}
                    className="text-xs font-black text-emerald-700 underline"
                  >
                    عرض الترتيب
                  </button>
                </div>
              )}

              {/* Judge Info & Project Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1">اسم المحكم العلمي</label>
                  <input
                    type="text"
                    required
                    value={judgeName}
                    onChange={(e) => setJudgeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1">الصفة الأكاديمية / الجهة</label>
                  <input
                    type="text"
                    value={judgeRole}
                    onChange={(e) => setJudgeRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1">اختر الجناح / المشروع (1 – 40)</label>
                  <select
                    value={selectedProjectCode}
                    onChange={(e) => setSelectedProjectCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-sky-400 text-xs font-black text-slate-900 bg-white"
                  >
                    {EVENT_DETAILS.projectsSample.map((p) => (
                      <option key={p.code} value={p.code}>
                        [{p.code}] {p.title} ({p.ageLabel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Project Banner */}
              {selectedProject && (
                <div className="bg-gradient-to-l from-slate-900 to-sky-950 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-amber-300">{selectedProject.code}</span>
                      <span className="text-xs bg-white/15 px-2.5 py-0.5 rounded-full font-bold">
                        {selectedProject.ageLabel}
                      </span>
                    </div>
                    <h4 className="text-base font-black mt-1">{selectedProject.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">فريق العمل: {selectedProject.students}</p>
                  </div>
                  <div className="bg-white/10 border border-amber-400/50 rounded-2xl px-4 py-2.5 text-center">
                    <span className="text-[11px] text-amber-300 font-bold block">المجموع النهائي</span>
                    <span className="text-2xl font-black text-white">{totalScore}</span>
                    <span className="text-xs text-slate-300"> / 100</span>
                  </div>
                </div>
              )}

              {/* 5 Sliders */}
              <div className="space-y-3">
                {CRITERIA_CONFIG.map((c) => (
                  <div key={c.key} className="bg-white border border-slate-200 rounded-2xl p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-black text-slate-800">{c.label}</label>
                      <span className="text-xs font-black bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-lg">
                        {scores[c.key]} / {c.max} درجة
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={c.max}
                      value={scores[c.key]}
                      onChange={(e) =>
                        setScores((prev) => ({ ...prev, [c.key]: Number(e.target.value) }))
                      }
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  توصية المحكم وملاحظاته التشجيعية للطفل (تظهر في سجل التقييم):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: عرض علمي متميز وثقة عالية بالنفس، يوصى بدعم المشروع..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 transition"
              >
                <Trophy className="w-5 h-5" />
                <span>اعتماد درجة التحكيم ({totalScore} / 100) وتحديث لوحة الصدارة</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
