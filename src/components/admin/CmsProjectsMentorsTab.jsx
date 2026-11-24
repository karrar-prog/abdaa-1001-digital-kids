import React, { useState } from 'react';
import {
  Save,
  Printer,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  ArrowLeftRight,
  Check
} from 'lucide-react';

function reindexProjectsList(list) {
  return (list || []).map((proj, index) => {
    const seq = index + 1;
    return {
      ...proj,
      id: seq,
      code: `ABD-PRJ-${String(seq).padStart(2, '0')}`
    };
  });
}

export default function CmsProjectsMentorsTab({
  subTabProjMentor,
  setSubTabProjMentor,
  projectsList,
  setProjectsList,
  mentorsList,
  setMentorsList,
  handleSaveProjectsAndMentors,
  handleBatchPrintMentorsIds,
  handlePrefillIdCardAndOpen,
  isSaving,
  readOnly = false
}) {
  const [projSearch, setProjSearch] = useState('');
  const [rankDrafts, setRankDrafts] = useState({});
  const [reorderBanner, setReorderBanner] = useState('');
  const [highlightedCode, setHighlightedCode] = useState('');

  const [newProj, setNewProj] = useState({
    title: '',
    track: 'Robotics',
    ageGroup: '10-11',
    students: '',
    prototype: 'نموذج ابتكاري حي',
    desc: ''
  });

  const [newMentor, setNewMentor] = useState({
    name: '',
    role: 'مدرب - متطوع',
    organization: 'نادي أبدع للمهارات الذكية',
    specialty: 'التدريب البرمجي والذكاء الاصطناعي',
    hours: 'الدفعة الأولى 2026',
    category: 'المدربون المتطوعون'
  });

  const moveProjectToPosition = (fromIdx, targetOneBased) => {
    const total = projectsList.length;
    if (fromIdx < 0 || fromIdx >= total) return;
    const parsed = parseInt(String(targetOneBased), 10);
    if (Number.isNaN(parsed)) {
      setRankDrafts({});
      return;
    }
    const clampedTargetIdx = Math.max(0, Math.min(total - 1, parsed - 1));
    setRankDrafts({});
    if (clampedTargetIdx === fromIdx) return;

    const copy = [...projectsList];
    const [moved] = copy.splice(fromIdx, 1);
    copy.splice(clampedTargetIdx, 0, moved);
    const reindexed = reindexProjectsList(copy);
    const newSeq = clampedTargetIdx + 1;
    const newCode = `ABD-PRJ-${String(newSeq).padStart(2, '0')}`;

    setProjectsList(reindexed);
    setHighlightedCode(newCode);
    setReorderBanner(
      `تم نقل «${moved.title || moved.students || 'المشروع'}» إلى التسلسل #${newSeq} (${newCode}) وإعادة ترقيم جميع الأجنحة تلقائياً — اضغط «حفظ ونشر سحابياً فوراً» للاعتماد.`
    );
    setTimeout(() => {
      setHighlightedCode((curr) => (curr === newCode ? '' : curr));
    }, 3000);
  };

  const handleAddProject = () => {
    if (!newProj.title.trim()) return;
    const ageLabelMap = {
      '7-9': 'فئة 6 – 9 سنوات',
      '10-11': 'فئة 10 – 11 سنة',
      '12-14': 'فئة 12 – 14 سنة'
    };
    const nextList = reindexProjectsList([
      {
        id: 1,
        legacyId: Date.now(),
        code: 'ABD-PRJ-01',
        title: newProj.title.trim(),
        track: newProj.track,
        ageGroup: newProj.ageGroup,
        ageLabel: ageLabelMap[newProj.ageGroup] || 'فئة 6 – 14 سنة',
        prototype: newProj.prototype.trim() || 'نموذج ابتكاري حي',
        iconType:
          newProj.track === 'Artificial Intelligence'
            ? 'ai-vision'
            : newProj.track === 'Programming'
              ? 'code-screen'
              : newProj.track === 'Cybersecurity'
                ? 'security'
                : 'robot',
        techTags: ['Arduino', 'Python', 'AI'],
        badge: 'ابتكار جديد',
        students: newProj.students.trim() || 'فريق أبطال أبدع',
        desc: newProj.desc.trim() || 'مشروع ابتكاري مقدم في معرض الدفعة الأولى لمبادرة 1001 طفل رقمي.',
        problem: 'معالجة تحدٍ واقعي باستخدام التقنية الحديثة.',
        solution: 'تطوير نموذج عملي مبرمج بأيدي الأطفال.',
        impact: 'أثر علمي ومجتمعي إيجابي في النجف الأشرف.',
        score: 95,
        votes: 10
      },
      ...projectsList
    ]);
    setProjectsList(nextList);
    setRankDrafts({});
    setNewProj({
      title: '',
      track: 'Robotics',
      ageGroup: '10-11',
      students: '',
      prototype: 'نموذج ابتكاري حي',
      desc: ''
    });
  };

  const handleAddMentor = () => {
    if (!newMentor.name.trim()) return;
    const nextNum = mentorsList.length + 1;
    const id = `MNT-2026-${String(nextNum).padStart(2, '0')}`;
    setMentorsList([
      ...mentorsList,
      {
        id,
        name: newMentor.name.trim(),
        role: newMentor.role.trim() || 'مدرب - متطوع',
        organization: newMentor.organization.trim() || 'نادي أبدع للمهارات الذكية',
        specialty: newMentor.specialty.trim() || 'التدريب البرمجي والذكاء الاصطناعي',
        cohortTitle: newMentor.organization.trim() || 'نادي أبدع للمهارات الذكية',
        ageFocus: '6 – 14 سنة',
        hours: newMentor.hours.trim() || 'الدفعة الأولى 2026',
        projectsCount: 4,
        badgeColor: 'sky',
        category: newMentor.category || 'المدربون المتطوعون'
      }
    ]);
    setNewMentor({
      name: '',
      role: 'مدرب - متطوع',
      organization: 'نادي أبدع للمهارات الذكية',
      specialty: 'التدريب البرمجي والذكاء الاصطناعي',
      hours: 'الدفعة الأولى 2026',
      category: 'المدربون المتطوعون'
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTabProjMentor('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              subTabProjMentor === 'projects'
                ? 'bg-sky-600 text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
            }`}
          >
            مشاريع المعرض ({projectsList.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTabProjMentor('mentors')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              subTabProjMentor === 'mentors'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
            }`}
          >
            المؤسسون والمدربون ({mentorsList.length})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {subTabProjMentor === 'mentors' && handleBatchPrintMentorsIds && (
            <button
              type="button"
              onClick={handleBatchPrintMentorsIds}
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-black flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة هويات الكادر ({mentorsList.length})</span>
            </button>
          )}
          {!readOnly ? (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveProjectsAndMentors}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جارٍ النشر السحابي...' : 'حفظ ونشر سحابياً فوراً'}</span>
            </button>
          ) : (
            <span className="px-3.5 py-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-xs font-black">
              وضع المشاهدة والطباعة فقط
            </span>
          )}
        </div>
      </div>

      {subTabProjMentor === 'projects' ? (
        <div className="space-y-4">
          {/* Add New Project Box */}
          {!readOnly && (
          <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-slate-800/70 border border-sky-200 dark:border-slate-700 space-y-3">
            <h5 className="text-xs font-black text-sky-900 dark:text-sky-300 font-alexandria flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>إضافة مشروع ابتكاري جديد للمعرض</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <input
                type="text"
                value={newProj.title}
                onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                placeholder="عنوان المشروع *"
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
              <select
                value={newProj.track}
                onChange={(e) => setNewProj({ ...newProj, track: e.target.value })}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="Robotics">Robotics (الروبوتات)</option>
                <option value="Artificial Intelligence">Artificial Intelligence (الذكاء الاصطناعي)</option>
                <option value="Programming">Programming (البرمجة)</option>
                <option value="Cybersecurity">Cybersecurity (الأمن السيبراني)</option>
              </select>
              <select
                value={newProj.ageGroup}
                onChange={(e) => setNewProj({ ...newProj, ageGroup: e.target.value })}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="7-9">فئة 6 – 9 سنوات</option>
                <option value="10-11">فئة 10 – 11 سنة</option>
                <option value="12-14">فئة 12 – 14 سنة</option>
              </select>
              <input
                type="text"
                value={newProj.students}
                onChange={(e) => setNewProj({ ...newProj, students: e.target.value })}
                placeholder="اسم الفريق أو الطلاب"
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={newProj.prototype}
                onChange={(e) => setNewProj({ ...newProj, prototype: e.target.value })}
                placeholder="نوع النموذج"
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={newProj.desc}
                onChange={(e) => setNewProj({ ...newProj, desc: e.target.value })}
                placeholder="وصف مختصر للمشروع"
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
              />
              <button
                type="button"
                onClick={handleAddProject}
                className="py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs transition cursor-pointer"
              >
                + إضافة المشروع الآن
              </button>
            </div>
          </div>
          )}

          {/* Search & Reorder Instructions Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={projSearch}
                onChange={(e) => setProjSearch(e.target.value)}
                placeholder="ابحث باسم المشروع أو الطالب أو رقم الجناح (مثال: مجتبى أو 12)..."
                className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            {!readOnly && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-3 py-2 rounded-xl">
                <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
                <span>
                  غيّر رقم أي مشروع واضغط <strong>Enter</strong> أو زر <strong>نقل</strong> (أو أسهم ▲▼) ليُعاد تسلسل وترقيم جميع الأجنحة تلقائياً.
                </span>
              </div>
            )}
          </div>

          {reorderBanner && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-xs font-black text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2">
              <span>✨ {reorderBanner}</span>
              <button
                type="button"
                onClick={() => setReorderBanner('')}
                className="text-[11px] px-2 py-0.5 rounded bg-amber-200/70 dark:bg-amber-900 text-amber-900 dark:text-amber-200 cursor-pointer shrink-0"
              >
                إخفاء
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {projectsList
              .map((proj, realIdx) => ({ proj, realIdx }))
              .filter(({ proj, realIdx }) => {
                const q = projSearch.trim().toLowerCase();
                if (!q) return true;
                const seqStr = String(realIdx + 1);
                return (
                  seqStr === q ||
                  `#${seqStr}` === q ||
                  String(proj.code || '').toLowerCase().includes(q) ||
                  String(proj.title || '').toLowerCase().includes(q) ||
                  String(proj.students || '').toLowerCase().includes(q)
                );
              })
              .map(({ proj, realIdx }) => {
                const currentSeq = realIdx + 1;
                const displayCode = `ABD-PRJ-${String(currentSeq).padStart(2, '0')}`;
                const draftKey = String(proj.legacyId || proj.code || realIdx);
                const draftVal =
                  rankDrafts[draftKey] !== undefined ? rankDrafts[draftKey] : String(currentSeq);
                const hasPendingRankChange =
                  draftVal.trim() !== '' && Number(draftVal) !== currentSeq;
                const isHighlighted = highlightedCode === displayCode;

                return (
                  <div
                    key={proj.legacyId || `${proj.title}-${realIdx}`}
                    className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
                      isHighlighted
                        ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/70 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {readOnly ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-mono font-bold shrink-0">
                            #{currentSeq} • {displayCode}
                          </span>
                          <div className="flex-1 text-xs font-black text-slate-900 dark:text-white">
                            {proj.title || ''}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{proj.students || ''}</span>
                          {proj.prototype && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
                              {proj.prototype}
                            </span>
                          )}
                        </div>
                        {proj.desc && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            {proj.desc}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Reorder & Sequence Control Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-200/70 dark:border-slate-700/70">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                              تسلسل:
                            </span>
                            <div className="inline-flex items-center bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700 rounded-lg overflow-hidden">
                              <span className="px-1.5 text-[11px] font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border-l border-sky-200 dark:border-sky-800">
                                #
                              </span>
                              <input
                                type="number"
                                min={1}
                                max={projectsList.length}
                                value={draftVal}
                                onChange={(e) =>
                                  setRankDrafts((prev) => ({ ...prev, [draftKey]: e.target.value }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    moveProjectToPosition(realIdx, draftVal);
                                  } else if (e.key === 'Escape') {
                                    setRankDrafts((prev) => {
                                      const next = { ...prev };
                                      delete next[draftKey];
                                      return next;
                                    });
                                  }
                                }}
                                onBlur={() => {
                                  if (hasPendingRankChange) {
                                    moveProjectToPosition(realIdx, draftVal);
                                  } else {
                                    setRankDrafts((prev) => {
                                      const next = { ...prev };
                                      delete next[draftKey];
                                      return next;
                                    });
                                  }
                                }}
                                title="غيّر رقم المشروع لنقله وإعادة التسلسل"
                                className="w-12 px-1 py-0.5 text-center text-xs font-mono font-black text-slate-900 dark:text-white bg-transparent focus:outline-none"
                              />
                            </div>
                            {hasPendingRankChange && (
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  moveProjectToPosition(realIdx, draftVal);
                                }}
                                className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black inline-flex items-center gap-0.5 cursor-pointer shadow-xs"
                                title="تطبيق النقل فوراً"
                              >
                                <Check className="w-3 h-3" />
                                <span>نقل</span>
                              </button>
                            )}
                            <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-mono font-bold">
                              {displayCode}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={realIdx === 0}
                              onClick={() => moveProjectToPosition(realIdx, currentSeq - 1)}
                              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white disabled:opacity-35 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                              title="تقديم للأعلى (تقليل الرقم)"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={realIdx === projectsList.length - 1}
                              onClick={() => moveProjectToPosition(realIdx, currentSeq + 1)}
                              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white disabled:opacity-35 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                              title="تأخير للأسفل (زيادة الرقم)"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRankDrafts({});
                                setProjectsList(
                                  reindexProjectsList(projectsList.filter((_, i) => i !== realIdx))
                                );
                              }}
                              className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer shrink-0"
                              title="حذف المشروع"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={proj.title || ''}
                          onChange={(e) => {
                            const copy = [...projectsList];
                            copy[realIdx] = { ...copy[realIdx], title: e.target.value };
                            setProjectsList(copy);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={proj.students || ''}
                            onChange={(e) => {
                              const copy = [...projectsList];
                              copy[realIdx] = { ...copy[realIdx], students: e.target.value };
                              setProjectsList(copy);
                            }}
                            placeholder="الفريق / الطلاب"
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                          />
                          <input
                            type="text"
                            value={proj.prototype || ''}
                            onChange={(e) => {
                              const copy = [...projectsList];
                              copy[realIdx] = { ...copy[realIdx], prototype: e.target.value };
                              setProjectsList(copy);
                            }}
                            placeholder="نوع النموذج"
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-amber-700 dark:text-amber-300"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={proj.desc || ''}
                          onChange={(e) => {
                            const copy = [...projectsList];
                            copy[realIdx] = { ...copy[realIdx], desc: e.target.value };
                            setProjectsList(copy);
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300"
                        />
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Add New Mentor Box */}
          {!readOnly && (
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 space-y-3">
            <h5 className="text-xs font-black text-amber-900 dark:text-amber-300 font-alexandria flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>إضافة مدرب أو مؤسس أو مشرف جديد للوحة الشرف</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={newMentor.name}
                onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
                placeholder="الاسم الكامل مع اللقب *"
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={newMentor.role}
                onChange={(e) => setNewMentor({ ...newMentor, role: e.target.value })}
                placeholder="الصفة (مثال: مدرب - متطوع)"
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={newMentor.organization}
                onChange={(e) => setNewMentor({ ...newMentor, organization: e.target.value })}
                placeholder="الجهة / الجامعة / الشركة"
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={newMentor.specialty}
                onChange={(e) => setNewMentor({ ...newMentor, specialty: e.target.value })}
                placeholder="التخصص العلمي"
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
              />
              <select
                value={newMentor.category}
                onChange={(e) => setNewMentor({ ...newMentor, category: e.target.value })}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="المدربون المتطوعون">المدربون المتطوعون</option>
                <option value="المؤسسون">المؤسسون</option>
                <option value="الشريك المنظم">الشريك المنظم</option>
                <option value="جامعة الفرات الأوسط التقنية">جامعة الفرات الأوسط التقنية</option>
                <option value="شركة المصدر">شركة المصدر</option>
                <option value="مدارس دار الزهراء الخيرية">مدارس دار الزهراء الخيرية</option>
                <option value="ديوان محافظة النجف الأشرف">ديوان محافظة النجف الأشرف</option>
              </select>
              <button
                type="button"
                onClick={handleAddMentor}
                className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
              >
                + إضافة للوحة الشرف
              </button>
            </div>
          </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {mentorsList.map((m, idx) => (
              <div
                key={m.id || idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2"
              >
                {readOnly ? (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold shrink-0">
                          {m.id}
                        </span>
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {m.name || ''}
                        </span>
                      </div>
                      {handlePrefillIdCardAndOpen && (
                        <button
                          type="button"
                          onClick={() =>
                            handlePrefillIdCardAndOpen({
                              fullName: m.name,
                              membershipId: `ABD-MNT-2026-${String(idx + 1).padStart(3, '0')}`,
                              roleTitle: m.role || 'مدرب ومشرف علمي معتمد',
                              track: m.specialty || 'التدريب البرمجي والذكاء الاصطناعي',
                              ageStage: 'الهيئة التدريبية والعلمية',
                              cityOrSchool: m.organization || 'نادي أبدع للمهارات الذكية',
                              badgeColor: '#0f766e'
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 hover:bg-teal-600 hover:text-white text-[10px] font-black transition cursor-pointer shrink-0"
                          title="طباعة هوية لهذا المدرب"
                        >
                          🪪 طباعة هوية
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="font-bold text-sky-700 dark:text-sky-300">{m.role || ''}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-slate-600 dark:text-slate-300">{m.organization || m.hours || ''}</span>
                    </div>
                    {m.specialty && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{m.specialty}</div>
                    )}
                  </>
                ) : (
                  <>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold shrink-0">
                    {m.id}
                  </span>
                  <input
                    type="text"
                    value={m.name || ''}
                    onChange={(e) => {
                      const copy = [...mentorsList];
                      copy[idx] = { ...copy[idx], name: e.target.value };
                      setMentorsList(copy);
                    }}
                    className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                  />
                  {handlePrefillIdCardAndOpen && (
                    <button
                      type="button"
                      onClick={() =>
                        handlePrefillIdCardAndOpen({
                          fullName: m.name,
                          membershipId: `ABD-MNT-2026-${String(idx + 1).padStart(3, '0')}`,
                          roleTitle: m.role || 'مدرب ومشرف علمي معتمد',
                          track: m.specialty || 'التدريب البرمجي والذكاء الاصطناعي',
                          ageStage: 'الهيئة التدريبية والعلمية',
                          cityOrSchool: m.organization || 'نادي أبدع للمهارات الذكية',
                          badgeColor: '#0f766e'
                        })
                      }
                      className="px-2 py-1 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 hover:bg-teal-600 hover:text-white text-[10px] font-black transition cursor-pointer shrink-0"
                      title="إصدار هوية لهذا المدرب"
                    >
                      🪪 هوية
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMentorsList(mentorsList.filter((_, i) => i !== idx))}
                    className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer shrink-0"
                    title="حذف المدرب"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={m.role || ''}
                    onChange={(e) => {
                      const copy = [...mentorsList];
                      copy[idx] = { ...copy[idx], role: e.target.value };
                      setMentorsList(copy);
                    }}
                    placeholder="الصفة"
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-sky-700 dark:text-sky-300"
                  />
                  <input
                    type="text"
                    value={m.organization || m.hours || ''}
                    onChange={(e) => {
                      const copy = [...mentorsList];
                      copy[idx] = { ...copy[idx], organization: e.target.value, cohortTitle: e.target.value };
                      setMentorsList(copy);
                    }}
                    placeholder="الجهة / المؤسسة"
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300"
                  />
                </div>
                <input
                  type="text"
                  value={m.specialty || ''}
                  onChange={(e) => {
                    const copy = [...mentorsList];
                    copy[idx] = { ...copy[idx], specialty: e.target.value };
                    setMentorsList(copy);
                  }}
                  placeholder="التخصص"
                  className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300"
                />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
