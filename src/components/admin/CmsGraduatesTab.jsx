import React from 'react';
import { Printer, Save, Trash2 } from 'lucide-react';

export default function CmsGraduatesTab({
  cohortsList,
  setCohortsList,
  selectedCohortIdx,
  setSelectedCohortIdx,
  currentCohort,
  newStudentName,
  setNewStudentName,
  handleAddGraduateToCohort,
  handleSaveCohorts,
  handleBatchPrintCohortIds,
  handlePrefillIdCardAndOpen,
  isSaving
}) {
  if (!currentCohort) return null;
  return (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
                  <div>
                    <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      إدارة قوائم الخريجين والمجموعات ({cohortsList.reduce((sum, c) => sum + ((c.graduates || c.students || []).length), 0)} خريجاً)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      تعديل اسم أي خريج أو إضافة خريج جديد يُحفظ سحابياً ويُحدّث فوراً في بطاقات التخرج والشهادات الثلاث وشاشة المسرح.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleBatchPrintCohortIds(selectedCohortIdx)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>طباعة هويات {currentCohort.name} دفعة واحدة</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSaveCohorts}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'جارٍ النشر السحابي...' : 'حفظ الخريجين سحابياً'}</span>
                    </button>
                  </div>
                </div>

                {/* Cohort Selector Pills */}
                <div className="flex flex-wrap gap-2">
                  {cohortsList.map((c, idx) => (
                    <button
                      key={c.code || c.id || idx}
                      type="button"
                      onClick={() => setSelectedCohortIdx(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                        selectedCohortIdx === idx
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {c.name} ({(c.graduates || c.students || []).length})
                    </button>
                  ))}
                </div>

                {/* Selected Cohort Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">اسم المجموعة</label>
                    <input
                      type="text"
                      value={currentCohort.name || ''}
                      onChange={(e) => {
                        const copy = [...cohortsList];
                        copy[selectedCohortIdx] = { ...copy[selectedCohortIdx], name: e.target.value };
                        setCohortsList(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">المسار العلمي</label>
                    <input
                      type="text"
                      value={currentCohort.track || ''}
                      onChange={(e) => {
                        const copy = [...cohortsList];
                        copy[selectedCohortIdx] = { ...copy[selectedCohortIdx], track: e.target.value };
                        setCohortsList(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">المدرب المشرف</label>
                    <input
                      type="text"
                      value={currentCohort.mentor || ''}
                      onChange={(e) => {
                        const copy = [...cohortsList];
                        copy[selectedCohortIdx] = { ...copy[selectedCohortIdx], mentor: e.target.value };
                        setCohortsList(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">الفئة العمرية</label>
                    <input
                      type="text"
                      value={currentCohort.ageStage || currentCohort.ageRange || ''}
                      onChange={(e) => {
                        const copy = [...cohortsList];
                        copy[selectedCohortIdx] = { ...copy[selectedCohortIdx], ageStage: e.target.value };
                        setCohortsList(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Add Graduate to Selected Cohort */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder={`إضافة اسم خريج جديد إلى ${currentCohort.name}...`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGraduateToCohort}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black transition cursor-pointer"
                  >
                    + إضافة خريج
                  </button>
                </div>

                {/* Graduates Grid for Selected Cohort */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {(currentCohort.graduates || currentCohort.students || []).map((st, sIdx) => {
                    const stName = typeof st === 'object' ? st.name : st;
                    return (
                      <div
                        key={(typeof st === 'object' && st.id) || sIdx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                      >
                        <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[11px] font-black flex items-center justify-center shrink-0">
                          {sIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={stName}
                          onChange={(e) => {
                            const copy = JSON.parse(JSON.stringify(cohortsList));
                            const listRef = copy[selectedCohortIdx].graduates || copy[selectedCohortIdx].students || [];
                            if (typeof listRef[sIdx] === 'object' && listRef[sIdx] !== null) {
                              listRef[sIdx].name = e.target.value;
                            } else {
                              listRef[sIdx] = { name: e.target.value };
                            }
                            copy[selectedCohortIdx].graduates = listRef;
                            setCohortsList(copy);
                          }}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const priorCount = cohortsList
                              .slice(0, selectedCohortIdx)
                              .reduce((sum, ch) => sum + ((ch.graduates || ch.students || []).length), 0);
                            const serial = String(priorCount + sIdx + 1).padStart(4, '0');
                            const memId = (typeof st === 'object' && st.initiativeCode) ? `ABD-ID-${st.initiativeCode}` : `ABD-ID-2026-${serial}`;
                            handlePrefillIdCardAndOpen({
                              fullName: stName,
                              membershipId: memId,
                              roleTitle: 'عضو خريج معتمد — مبادرة 1001 طفل رقمي',
                              track: (typeof st === 'object' && st.track) || currentCohort.track || 'البرمجة والذكاء الاصطناعي والروبوتات',
                              ageStage: (typeof st === 'object' && st.ageGroup) || currentCohort.ageStage || currentCohort.ageRange || 'الأعمار 6 – 14 سنة',
                              cityOrSchool: `${currentCohort.name} — النجف الأشرف`,
                              badgeColor: '#0284c7'
                            });
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-[10px] font-black transition cursor-pointer shrink-0"
                          title="إصدار هوية انتماء رسمية لهذا الخريج"
                        >
                          🪪 هوية
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const copy = JSON.parse(JSON.stringify(cohortsList));
                            const listRef = copy[selectedCohortIdx].graduates || copy[selectedCohortIdx].students || [];
                            copy[selectedCohortIdx].graduates = listRef.filter((_, i) => i !== sIdx);
                            setCohortsList(copy);
                          }}
                          className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                          title="حذف الاسم"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
  );
}
