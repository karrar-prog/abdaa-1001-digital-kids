import React, { useState } from 'react';
import { Save, Plus, Trash2, BookOpen, Layers, Cpu } from 'lucide-react';

export default function CmsStoryTracksTab({
  storyForm,
  setStoryForm,
  ageStagesList,
  setAgeStagesList,
  tracksList,
  setTracksList,
  handleSaveStoryAndTracks,
  isSaving
}) {
  const [subTab, setSubTab] = useState('story');

  const highlights = Array.isArray(storyForm?.highlights) ? storyForm.highlights : [];

  const handleAddHighlight = () => {
    setStoryForm({
      ...storyForm,
      highlights: [...highlights, { title: 'ميزة جديدة للمبادرة', desc: 'وصف مختصر يظهر في بطاقة الإنجازات' }]
    });
  };

  const handleAddTrack = () => {
    setTracksList([
      ...tracksList,
      {
        id: `track-${Date.now()}`,
        name: 'مسار تقني جديد',
        tag: 'Tech Track',
        ageTarget: '6 – 14 سنة',
        color: 'from-sky-500 to-blue-600',
        description: 'وصف موجز لمحتوى المسار التدريبي ومخرجاته العملية.',
        icon: 'Code2'
      }
    ]);
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
        <div>
          <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
            إدارة قصة النادي، المراحل العمرية (6–14 سنة)، والمسارات العلمية
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            عدّل النصوص والمهارات والمسارات لتنعكس سحابياً فوراً لجميع الزوار.
          </p>
        </div>
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSaveStoryAndTracks}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'جارٍ الحفظ السحابي...' : 'حفظ ونشر سحابياً فوراً'}</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSubTab('story')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
            subTab === 'story'
              ? 'bg-sky-600 text-white shadow'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>قصة النادي وبطاقة الإنجاز</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('stages')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
            subTab === 'stages'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>المراحل العمرية ({ageStagesList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('tracks')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
            subTab === 'tracks'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>المسارات العلمية ({tracksList.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: STORY */}
      {subTab === 'story' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                الشارة العلوية (Badge)
              </label>
              <input
                type="text"
                value={storyForm.badge || ''}
                onChange={(e) => setStoryForm({ ...storyForm, badge: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                نص زر الدعوة للحجز (CTA)
              </label>
              <input
                type="text"
                value={storyForm.ctaText || ''}
                onChange={(e) => setStoryForm({ ...storyForm, ctaText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                العنوان الرئيسي — السطر الأول
              </label>
              <input
                type="text"
                value={storyForm.headlineLine1 || ''}
                onChange={(e) => setStoryForm({ ...storyForm, headlineLine1: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                العنوان الرئيسي — السطر الملون المميز
              </label>
              <input
                type="text"
                value={storyForm.headlineHighlight || ''}
                onChange={(e) => setStoryForm({ ...storyForm, headlineHighlight: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-sky-600 dark:text-sky-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                الفقرة الأولى من القصة
              </label>
              <textarea
                rows={3}
                value={storyForm.paragraph1 || ''}
                onChange={(e) => setStoryForm({ ...storyForm, paragraph1: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 leading-relaxed"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                الفقرة الثانية من القصة
              </label>
              <textarea
                rows={2}
                value={storyForm.paragraph2 || ''}
                onChange={(e) => setStoryForm({ ...storyForm, paragraph2: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                الاقتباس الملهم (Quote)
              </label>
              <textarea
                rows={2}
                value={storyForm.quote || ''}
                onChange={(e) => setStoryForm({ ...storyForm, quote: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                مصدر الاقتباس
              </label>
              <input
                type="text"
                value={storyForm.quoteAuthor || ''}
                onChange={(e) => setStoryForm({ ...storyForm, quoteAuthor: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Trophy Card Settings */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-amber-400/40 space-y-3">
            <h5 className="text-xs font-black text-amber-300 font-alexandria">
              بطاقة الكأس والإنجازات العربية (العمود الأيسر)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={storyForm.trophyBadge || ''}
                onChange={(e) => setStoryForm({ ...storyForm, trophyBadge: e.target.value })}
                placeholder="شارة الكأس"
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-amber-300"
              />
              <input
                type="text"
                value={storyForm.trophyTitle || ''}
                onChange={(e) => setStoryForm({ ...storyForm, trophyTitle: e.target.value })}
                placeholder="عنوان الإنجاز"
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-black text-white"
              />
              <input
                type="text"
                value={storyForm.trophySubtitle || ''}
                onChange={(e) => setStoryForm({ ...storyForm, trophySubtitle: e.target.value })}
                placeholder="الوصف الفرعي للإنجاز"
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-sky-200"
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300">نقاط القوة البارزة ({highlights.length})</span>
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة نقطة</span>
                </button>
              </div>
              {highlights.map((hl, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={hl.title}
                    onChange={(e) => {
                      const copy = [...highlights];
                      copy[idx] = { ...copy[idx], title: e.target.value };
                      setStoryForm({ ...storyForm, highlights: copy });
                    }}
                    placeholder="العنوان"
                    className="sm:col-span-5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-white"
                  />
                  <input
                    type="text"
                    value={hl.desc}
                    onChange={(e) => {
                      const copy = [...highlights];
                      copy[idx] = { ...copy[idx], desc: e.target.value };
                      setStoryForm({ ...storyForm, highlights: copy });
                    }}
                    placeholder="الوصف"
                    className="sm:col-span-6 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setStoryForm({
                        ...storyForm,
                        highlights: highlights.filter((_, i) => i !== idx)
                      })
                    }
                    className="sm:col-span-1 p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: AGE STAGES */}
      {subTab === 'stages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {ageStagesList.map((st, idx) => (
            <div
              key={st.id || idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">الفئة العمرية</label>
                  <input
                    type="text"
                    value={st.ageBadge || ''}
                    onChange={(e) => {
                      const copy = [...ageStagesList];
                      copy[idx] = { ...copy[idx], ageBadge: e.target.value };
                      setAgeStagesList(copy);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">المسمى بالإنجليزية</label>
                  <input
                    type="text"
                    value={st.engTitle || ''}
                    onChange={(e) => {
                      const copy = [...ageStagesList];
                      copy[idx] = { ...copy[idx], engTitle: e.target.value };
                      setAgeStagesList(copy);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">اسم المرحلة</label>
                <input
                  type="text"
                  value={st.title || ''}
                  onChange={(e) => {
                    const copy = [...ageStagesList];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    setAgeStagesList(copy);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">الملخص الأكاديمي</label>
                <textarea
                  rows={2}
                  value={st.summary || ''}
                  onChange={(e) => {
                    const copy = [...ageStagesList];
                    copy[idx] = { ...copy[idx], summary: e.target.value };
                    setAgeStagesList(copy);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                  المهارات المكتسبة (كل مهارة في سطر منفصل)
                </label>
                <textarea
                  rows={4}
                  value={(st.skills || []).join('\n')}
                  onChange={(e) => {
                    const copy = [...ageStagesList];
                    copy[idx] = {
                      ...copy[idx],
                      skills: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
                    };
                    setAgeStagesList(copy);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                  الأدوات والتقنيات (مفصولة بفاصلة ,)
                </label>
                <input
                  type="text"
                  value={(st.tools || []).join(', ')}
                  onChange={(e) => {
                    const copy = [...ageStagesList];
                    copy[idx] = {
                      ...copy[idx],
                      tools: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                    };
                    setAgeStagesList(copy);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: CORE TECHNICAL TRACKS */}
      {subTab === 'tracks' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddTrack}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مسار علمي جديد</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tracksList.map((tr, idx) => (
              <div
                key={tr.id || idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={tr.name || ''}
                    onChange={(e) => {
                      const copy = [...tracksList];
                      copy[idx] = { ...copy[idx], name: e.target.value };
                      setTracksList(copy);
                    }}
                    placeholder="اسم المسار"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
                  />
                  {tracksList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setTracksList(tracksList.filter((_, i) => i !== idx))}
                      className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                      title="حذف المسار"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={tr.tag || ''}
                    onChange={(e) => {
                      const copy = [...tracksList];
                      copy[idx] = { ...copy[idx], tag: e.target.value };
                      setTracksList(copy);
                    }}
                    placeholder="Tag"
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300"
                  />
                  <input
                    type="text"
                    value={tr.ageTarget || ''}
                    onChange={(e) => {
                      const copy = [...tracksList];
                      copy[idx] = { ...copy[idx], ageTarget: e.target.value };
                      setTracksList(copy);
                    }}
                    placeholder="الفئة العمرية"
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-sky-600"
                  />
                  <select
                    value={tr.icon || 'Code2'}
                    onChange={(e) => {
                      const copy = [...tracksList];
                      copy[idx] = { ...copy[idx], icon: e.target.value };
                      setTracksList(copy);
                    }}
                    className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200"
                  >
                    <option value="Code2">أيقونة برمجة</option>
                    <option value="Bot">أيقونة روبوت</option>
                    <option value="Brain">أيقونة ذكاء اصطناعي</option>
                    <option value="ShieldCheck">أيقونة أمن سيبراني</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  value={tr.description || ''}
                  onChange={(e) => {
                    const copy = [...tracksList];
                    copy[idx] = { ...copy[idx], description: e.target.value };
                    setTracksList(copy);
                  }}
                  placeholder="وصف المسار"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
