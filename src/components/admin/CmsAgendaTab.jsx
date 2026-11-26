import React from 'react';
import { Save, ArrowUp, ArrowDown, Trash2, Printer, ShieldCheck, FileText } from 'lucide-react';
import { EVENT_DETAILS, getActiveCohorts, getActiveProjects } from '../../data/eventData';
import { HONOROLL_MENTORS } from '../../data/mentorsData';
import { openOfficialAgendaPrintWindow, openProtocolAgendaPrintWindow } from '../../utils/print/agendaPrint';
import { buildFieldOperationsGroups, loadFieldPlanAssignments } from '../../utils/fieldOperationsPlan';
import { openFieldOperationsPrintWindow } from '../../utils/print/fieldOperationsPrint';

const PHASE_OPTIONS = [
  { id: 'reception', label: 'الفترة الأولى: الاستقبال الرئاسي، الصورة، المعرض والمتحف' },
  { id: 'opening', label: 'الفترة الثانية: الافتتاح الرسمي والكلمات البروتوكولية' },
  { id: 'initiative', label: 'الفترة الثالثة: فقرات المبادرة والتكريم الرئاسي' },
  { id: 'honoring', label: 'الفترة الرابعة: التكريم والتتويج' },
  { id: 'closing', label: 'الفترة الخامسة: الختام وجولة العائلات' }
];

export default function CmsAgendaTab({
  agendaList,
  setAgendaList,
  newAgenda,
  setNewAgenda,
  handleSaveAgenda,
  handleAddAgendaItem,
  moveItem,
  isSaving,
  volunteers = []
}) {
  const handlePrintFieldOps = () => {
    const planData = buildFieldOperationsGroups({
      cohorts: getActiveCohorts(),
      projects: getActiveProjects(),
      mentors: HONOROLL_MENTORS,
      volunteers,
      boothGroupSize: 5,
      hallGroupSize: 5,
      savedSupervisors: loadFieldPlanAssignments()
    });
    openFieldOperationsPrintWindow(planData, EVENT_DETAILS.agendaMeta || {}, { section: 'all', directPrint: false });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
        <div>
          <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
            إدارة فقرات المنهاج الزمني للاحتفالية ({agendaList.length} فقرة)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            عدّل أوقات الفقرات أو المتحدثين أو اطبع المنهاج الرسمي وخطة توزيع المتطوعين (كل 5 أطفال/متابع) وحراسة البوثات.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrintFieldOps}
            className="px-4 py-2.5 rounded-xl bg-[#00185C] hover:bg-sky-800 text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>طباعة الخطة التشغيلية (5 أطفال/متابع)</span>
          </button>
          <button
            type="button"
            onClick={() =>
              openProtocolAgendaPrintWindow(agendaList, EVENT_DETAILS.agendaMeta || {})
            }
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            title="نسخة رسمية مبسّطة بخطوط واضحة وبدون زوائد لإرسالها لدائرة المراسم"
          >
            <FileText className="w-4 h-4" />
            <span>طباعة رسمية للمراسم (A4)</span>
          </button>
          <button
            type="button"
            onClick={() =>
              openOfficialAgendaPrintWindow(
                agendaList,
                EVENT_DETAILS.agendaPhases || [],
                EVENT_DETAILS.agendaMeta || {}
              )
            }
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة المنهاج الكامل (A4)</span>
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAgenda}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'جارٍ النشر السحابي...' : 'حفظ المنهاج سحابياً'}</span>
          </button>
        </div>
      </div>

      {/* Add Agenda Item */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
        <input
          type="text"
          value={newAgenda.time}
          onChange={(e) => setNewAgenda({ ...newAgenda, time: e.target.value })}
          placeholder="الوقت (مثال: 3:20 – 3:30)"
          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
        />
        <input
          type="text"
          value={newAgenda.title}
          onChange={(e) => setNewAgenda({ ...newAgenda, title: e.target.value })}
          placeholder="عنوان الفقرة *"
          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
        />
        <input
          type="text"
          value={newAgenda.speaker || ''}
          onChange={(e) => setNewAgenda({ ...newAgenda, speaker: e.target.value })}
          placeholder="المقدم / المتحدث"
          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
        />
        <select
          value={newAgenda.phaseId || 'opening'}
          onChange={(e) => setNewAgenda({ ...newAgenda, phaseId: e.target.value })}
          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
        >
          {PHASE_OPTIONS.map((ph) => (
            <option key={ph.id} value={ph.id}>
              {ph.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newAgenda.description}
          onChange={(e) => setNewAgenda({ ...newAgenda, description: e.target.value })}
          placeholder="وصف الفقرة"
          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
        />
        <button
          type="button"
          onClick={handleAddAgendaItem}
          className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
        >
          + إضافة فقرة جديدة
        </button>
      </div>

      <div className="space-y-2.5">
        {agendaList.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
              <input
                type="text"
                value={item.time || ''}
                onChange={(e) => {
                  const copy = [...agendaList];
                  copy[idx] = { ...copy[idx], time: e.target.value };
                  setAgendaList(copy);
                }}
                placeholder="الوقت"
                className="lg:col-span-2 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-sky-600 text-center"
              />
              <input
                type="text"
                value={item.duration || ''}
                onChange={(e) => {
                  const raw = e.target.value;
                  const numMatch = raw.match(/\d+/);
                  const copy = [...agendaList];
                  copy[idx] = {
                    ...copy[idx],
                    duration: raw,
                    ...(numMatch ? { durationMinutes: Number(numMatch[0]) } : {})
                  };
                  setAgendaList(copy);
                }}
                placeholder="المدة (مثال: 5 دقائق)"
                className="lg:col-span-2 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-amber-700 dark:text-amber-300 text-center"
              />
              <select
                value={item.phaseId || 'opening'}
                onChange={(e) => {
                  const copy = [...agendaList];
                  copy[idx] = { ...copy[idx], phaseId: e.target.value };
                  setAgendaList(copy);
                }}
                title="القسم / الفترة"
                className="lg:col-span-3 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-sky-200"
              >
                {PHASE_OPTIONS.map((ph) => (
                  <option key={ph.id} value={ph.id}>
                    {ph.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => {
                  const copy = [...agendaList];
                  copy[idx] = { ...copy[idx], title: e.target.value };
                  setAgendaList(copy);
                }}
                placeholder="عنوان الفقرة"
                className="lg:col-span-3 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
              />
              <div className="lg:col-span-2 flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => moveItem(agendaList, setAgendaList, idx, -1)}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-200 cursor-pointer"
                  title="للأعلى"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(agendaList, setAgendaList, idx, 1)}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-200 cursor-pointer"
                  title="للأسفل"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setAgendaList(agendaList.filter((_, i) => i !== idx))}
                  className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-300 cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
              <input
                type="text"
                value={item.speaker || ''}
                onChange={(e) => {
                  const copy = [...agendaList];
                  copy[idx] = { ...copy[idx], speaker: e.target.value };
                  setAgendaList(copy);
                }}
                placeholder="المقدم / المتحدث"
                className="lg:col-span-5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-indigo-700 dark:text-indigo-300"
              />
              <input
                type="text"
                value={item.description || ''}
                onChange={(e) => {
                  const copy = [...agendaList];
                  copy[idx] = { ...copy[idx], description: e.target.value };
                  setAgendaList(copy);
                }}
                placeholder="وصف الفقرة"
                className="lg:col-span-7 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
