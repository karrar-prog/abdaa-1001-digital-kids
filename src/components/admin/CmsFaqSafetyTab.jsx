import React, { useState } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, ShieldCheck, HelpCircle } from 'lucide-react';

export default function CmsFaqSafetyTab({
  safetyPillars,
  setSafetyPillars,
  faqsList,
  setFaqsList,
  handleSaveFaqAndSafety,
  moveItem,
  isSaving
}) {
  const [newPillar, setNewPillar] = useState({ title: '', desc: '' });
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });

  const handleAddPillar = () => {
    if (!newPillar.title.trim()) return;
    setSafetyPillars([...safetyPillars, { title: newPillar.title.trim(), desc: newPillar.desc.trim() }]);
    setNewPillar({ title: '', desc: '' });
  };

  const handleAddFaq = () => {
    if (!newFaq.q.trim() || !newFaq.a.trim()) return;
    setFaqsList([...faqsList, { q: newFaq.q.trim(), a: newFaq.a.trim() }]);
    setNewFaq({ q: '', a: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
        <div>
          <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
            إدارة ميثاق الأمان الرقمي والأسئلة الشائعة لأولياء الأمور
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            أضف أو عدّل بنود ميثاق الأمان التربوي وإجابات الأسئلة الشائعة ليتم نشرها سحابياً للجميع.
          </p>
        </div>
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSaveFaqAndSafety}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'جارٍ الحفظ السحابي...' : 'حفظ ونشر سحابياً فوراً'}</span>
        </button>
      </div>

      {/* SECTION 1: SAFETY PILLARS */}
      <div className="space-y-3">
        <h5 className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-300 font-alexandria flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>1. ركائز ميثاق الأمان الرقمي والتربوي ({safetyPillars.length})</span>
        </h5>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/70 border border-emerald-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <input
            type="text"
            value={newPillar.title}
            onChange={(e) => setNewPillar({ ...newPillar, title: e.target.value })}
            placeholder="عنوان ركيزة أمان جديدة..."
            className="sm:col-span-4 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
          <input
            type="text"
            value={newPillar.desc}
            onChange={(e) => setNewPillar({ ...newPillar, desc: e.target.value })}
            placeholder="شرح تفصيلي للركيزة..."
            className="sm:col-span-6 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
          />
          <button
            type="button"
            onClick={handleAddPillar}
            className="sm:col-span-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة ركيزة</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {safetyPillars.map((p, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-black flex items-center justify-center shrink-0">
                  0{idx + 1}
                </span>
                <input
                  type="text"
                  value={p.title || ''}
                  onChange={(e) => {
                    const copy = [...safetyPillars];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    setSafetyPillars(copy);
                  }}
                  className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setSafetyPillars(safetyPillars.filter((_, i) => i !== idx))}
                  className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                value={p.desc || ''}
                onChange={(e) => {
                  const copy = [...safetyPillars];
                  copy[idx] = { ...copy[idx], desc: e.target.value };
                  setSafetyPillars(copy);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: PARENT FAQS */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h5 className="text-xs sm:text-sm font-black text-amber-700 dark:text-amber-300 font-alexandria flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>2. الأسئلة الشائعة وإجاباتها ({faqsList.length})</span>
        </h5>

        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 space-y-2.5">
          <input
            type="text"
            value={newFaq.q}
            onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
            placeholder="نص السؤال الجديد..."
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
          <div className="flex flex-col sm:flex-row gap-2.5">
            <textarea
              rows={2}
              value={newFaq.a}
              onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
              placeholder="الإجابة الوافية..."
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
            />
            <button
              type="button"
              onClick={handleAddFaq}
              className="sm:w-44 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة سؤال جديد</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {faqsList.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3"
            >
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={faq.q || ''}
                  onChange={(e) => {
                    const copy = [...faqsList];
                    copy[idx] = { ...copy[idx], q: e.target.value };
                    setFaqsList(copy);
                  }}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                />
                <textarea
                  rows={2}
                  value={faq.a || ''}
                  onChange={(e) => {
                    const copy = [...faqsList];
                    copy[idx] = { ...copy[idx], a: e.target.value };
                    setFaqsList(copy);
                  }}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                />
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(faqsList, setFaqsList, idx, -1)}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(faqsList, setFaqsList, idx, 1)}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setFaqsList(faqsList.filter((_, i) => i !== idx))}
                  className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-600 hover:text-white text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
