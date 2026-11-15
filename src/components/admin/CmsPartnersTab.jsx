import React from 'react';
import { Save, Upload, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

export default function CmsPartnersTab({
  strategicPartners,
  setStrategicPartners,
  sponsorsList,
  setSponsorsList,
  newSponsor,
  setNewSponsor,
  handleSavePartnersAndSponsors,
  handleAddSponsor,
  handleImageFileUpload,
  moveItem
}) {
  return (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
                  <div>
                    <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      إدارة الشركاء الرئيسيين (نادي أبدع ومصدر) وقائمة الرعاة والداعمين
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      يمكنك تعديل النصوص، رفع شعار جديد مباشرةً من جهازك، تحديد رعاة الصف الأول المميز، أو تغيير الترتيب.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSavePartnersAndSponsors}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ الشركاء والرعاة فوراً</span>
                  </button>
                </div>

                {/* Strategic Partners Editor */}
                <div className="space-y-3">
                  <h5 className="text-xs sm:text-sm font-black text-sky-700 dark:text-sky-300 font-alexandria">
                    1. الشركاء الرئيسيون للمبادرة (Partners)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {strategicPartners.map((sp, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 space-y-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={sp.logo}
                            alt={sp.name}
                            className="w-16 h-16 rounded-xl bg-white p-2 object-contain border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              value={sp.name}
                              onChange={(e) => {
                                const copy = [...strategicPartners];
                                copy[idx] = { ...copy[idx], name: e.target.value };
                                setStrategicPartners(copy);
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                              placeholder="اسم الشريك"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={sp.role}
                                onChange={(e) => {
                                  const copy = [...strategicPartners];
                                  copy[idx] = { ...copy[idx], role: e.target.value };
                                  setStrategicPartners(copy);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-sky-700 dark:text-sky-300"
                                placeholder="الصفة"
                              />
                              <input
                                type="text"
                                value={sp.badge}
                                onChange={(e) => {
                                  const copy = [...strategicPartners];
                                  copy[idx] = { ...copy[idx], badge: e.target.value };
                                  setStrategicPartners(copy);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-amber-600"
                                placeholder="الشارة"
                              />
                            </div>
                          </div>
                        </div>
                        <textarea
                          rows={2}
                          value={sp.desc}
                          onChange={(e) => {
                            const copy = [...strategicPartners];
                            copy[idx] = { ...copy[idx], desc: e.target.value };
                            setStrategicPartners(copy);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                          placeholder="وصف الشريك"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={sp.logo}
                            onChange={(e) => {
                              const copy = [...strategicPartners];
                              copy[idx] = { ...copy[idx], logo: e.target.value };
                              setStrategicPartners(copy);
                            }}
                            className="flex-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-500"
                            placeholder="رابط الشعار"
                          />
                          <label className="px-3 py-1 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[11px] font-bold cursor-pointer hover:bg-sky-200 transition">
                            رفع شعار
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e.target.files?.[0], (dataUrl) => {
                                  const copy = [...strategicPartners];
                                  copy[idx] = { ...copy[idx], logo: dataUrl };
                                  setStrategicPartners(copy);
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Sponsor Box */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 space-y-3">
                  <h5 className="text-xs font-black text-amber-900 dark:text-amber-300 font-alexandria flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>إضافة راعٍ أو داعم جديد</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                    <input
                      type="text"
                      value={newSponsor.name}
                      onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                      placeholder="اسم الجهة أو الشركة الراعية"
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={newSponsor.role}
                      onChange={(e) => setNewSponsor({ ...newSponsor, role: e.target.value })}
                      placeholder="الصفة (مثال: راعٍ رئيسي وداعم)"
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-sky-700 dark:text-sky-300 cursor-pointer text-center">
                        {newSponsor.logo ? 'تم اختيار الشعار ✓' : 'رفع صورة الشعار 📁'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e.target.files?.[0], (dataUrl) =>
                              setNewSponsor({ ...newSponsor, logo: dataUrl })
                            )
                          }
                        />
                      </label>
                      <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newSponsor.featured}
                          onChange={(e) =>
                            setNewSponsor({
                              ...newSponsor,
                              featured: e.target.checked,
                              highlight: e.target.checked
                            })
                          }
                        />
                        <span>صف أول مميز</span>
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSponsor}
                      className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
                    >
                      + إضافة الراعي الآن
                    </button>
                  </div>
                </div>

                {/* Sponsors List Editor */}
                <div className="space-y-2.5">
                  <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-alexandria">
                    2. قائمة الرعاة والداعمين الحاليين ({sponsorsList.length} راعٍ)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sponsorsList.map((sp, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border flex items-center gap-3 ${
                          sp.featured
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl bg-white p-1.5 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                          {sp.logo ? (
                            <img src={sp.logo} alt={sp.name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="text-[10px] text-slate-400">بدون شعار</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <input
                            type="text"
                            value={sp.name}
                            onChange={(e) => {
                              const copy = [...sponsorsList];
                              copy[idx] = { ...copy[idx], name: e.target.value };
                              setSponsorsList(copy);
                            }}
                            className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                          />
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={sp.role}
                              onChange={(e) => {
                                const copy = [...sponsorsList];
                                copy[idx] = { ...copy[idx], role: e.target.value };
                                setSponsorsList(copy);
                              }}
                              className="flex-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300"
                            />
                            <label className="flex items-center gap-1 text-[10px] font-extrabold text-amber-800 dark:text-amber-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(sp.featured)}
                                onChange={(e) => {
                                  const copy = [...sponsorsList];
                                  copy[idx] = {
                                    ...copy[idx],
                                    featured: e.target.checked,
                                    highlight: e.target.checked ? true : copy[idx].highlight
                                  };
                                  setSponsorsList(copy);
                                }}
                              />
                              <span>صف أول كبار الرعاة</span>
                            </label>
                            <label className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold cursor-pointer">
                              تغيير الشعار
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageFileUpload(e.target.files?.[0], (dataUrl) => {
                                    const copy = [...sponsorsList];
                                    copy[idx] = { ...copy[idx], logo: dataUrl };
                                    setSponsorsList(copy);
                                  })
                                }
                              />
                            </label>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveItem(sponsorsList, setSponsorsList, idx, -1)}
                            className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-200 transition cursor-pointer"
                            title="تحريك للأعلى"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(sponsorsList, setSponsorsList, idx, 1)}
                            className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-200 transition cursor-pointer"
                            title="تحريك للأسفل"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const copy = sponsorsList.filter((_, i) => i !== idx);
                              setSponsorsList(copy);
                            }}
                            className="p-1 rounded bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-300 transition cursor-pointer"
                            title="حذف الراعي"
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
