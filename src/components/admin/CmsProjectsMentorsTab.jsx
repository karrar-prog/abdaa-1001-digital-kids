import React from 'react';
import { Save, Printer } from 'lucide-react';

export default function CmsProjectsMentorsTab({
  subTabProjMentor,
  setSubTabProjMentor,
  projectsList,
  setProjectsList,
  mentorsList,
  setMentorsList,
  handleSaveProjectsAndMentors,
  handleBatchPrintMentorsIds,
  handlePrefillIdCardAndOpen
}) {
  return (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSubTabProjMentor('projects')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                        subTabProjMentor === 'projects'
                          ? 'bg-sky-600 text-white'
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
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      المدربون والمشرفون ({mentorsList.length})
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveProjectsAndMentors}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ التعديلات فوراً</span>
                  </button>
                </div>

                {subTabProjMentor === 'projects' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                    {projectsList.map((proj, idx) => (
                      <div
                        key={proj.id || idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-mono font-bold">
                            {proj.code}
                          </span>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const copy = [...projectsList];
                              copy[idx] = { ...copy[idx], title: e.target.value };
                              setProjectsList(copy);
                            }}
                            className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={proj.students}
                            onChange={(e) => {
                              const copy = [...projectsList];
                              copy[idx] = { ...copy[idx], students: e.target.value };
                              setProjectsList(copy);
                            }}
                            placeholder="الفريق / الطلاب"
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                          />
                          <input
                            type="text"
                            value={proj.prototype}
                            onChange={(e) => {
                              const copy = [...projectsList];
                              copy[idx] = { ...copy[idx], prototype: e.target.value };
                              setProjectsList(copy);
                            }}
                            placeholder="نوع النموذج"
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-amber-700 dark:text-amber-300"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={proj.desc}
                          onChange={(e) => {
                            const copy = [...projectsList];
                            copy[idx] = { ...copy[idx], desc: e.target.value };
                            setProjectsList(copy);
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                    {mentorsList.map((m, idx) => (
                      <div
                        key={m.id || idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold">
                            {m.id}
                          </span>
                          <input
                            type="text"
                            value={m.name}
                            onChange={(e) => {
                              const copy = [...mentorsList];
                              copy[idx] = { ...copy[idx], name: e.target.value };
                              setMentorsList(copy);
                            }}
                            className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={m.role}
                            onChange={(e) => {
                              const copy = [...mentorsList];
                              copy[idx] = { ...copy[idx], role: e.target.value };
                              setMentorsList(copy);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-sky-700 dark:text-sky-300"
                          />
                          <input
                            type="text"
                            value={m.hours}
                            onChange={(e) => {
                              const copy = [...mentorsList];
                              copy[idx] = { ...copy[idx], hours: e.target.value };
                              setMentorsList(copy);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300"
                          />
                        </div>
                        <input
                          type="text"
                          value={m.specialty}
                          onChange={(e) => {
                            const copy = [...mentorsList];
                            copy[idx] = { ...copy[idx], specialty: e.target.value };
                            setMentorsList(copy);
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
  );
}
