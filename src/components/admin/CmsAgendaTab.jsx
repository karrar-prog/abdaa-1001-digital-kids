import React from 'react';
import { Save, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

export default function CmsAgendaTab({
  agendaList,
  setAgendaList,
  newAgenda,
  setNewAgenda,
  handleSaveAgenda,
  handleAddAgendaItem,
  moveItem
}) {
  return (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
                  <div>
                    <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      إدارة فقرات المنهاج الزمني للاحتفالية (Agenda)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      عدّل أوقات الفقرات أو عناوينها أو أضف فقرة جديدة للحفل.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveAgenda}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ المنهاج الزمني فوراً</span>
                  </button>
                </div>

                {/* Add Agenda Item */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newAgenda.time}
                    onChange={(e) => setNewAgenda({ ...newAgenda, time: e.target.value })}
                    placeholder="الوقت (مثال: 3:20 م)"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newAgenda.title}
                    onChange={(e) => setNewAgenda({ ...newAgenda, title: e.target.value })}
                    placeholder="عنوان الفقرة"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
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
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-3"
                    >
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => {
                          const copy = [...agendaList];
                          copy[idx] = { ...copy[idx], time: e.target.value };
                          setAgendaList(copy);
                        }}
                        className="w-full sm:w-28 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-sky-600 text-center"
                      />
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const copy = [...agendaList];
                          copy[idx] = { ...copy[idx], title: e.target.value };
                          setAgendaList(copy);
                        }}
                        className="w-full sm:w-64 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const copy = [...agendaList];
                          copy[idx] = { ...copy[idx], description: e.target.value };
                          setAgendaList(copy);
                        }}
                        className="flex-1 w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveItem(agendaList, setAgendaList, idx, -1)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(agendaList, setAgendaList, idx, 1)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAgendaList(agendaList.filter((_, i) => i !== idx))}
                          className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  );
}
