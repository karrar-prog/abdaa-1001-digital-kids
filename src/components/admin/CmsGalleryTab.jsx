import React, { useState } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Sparkles } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'robotics', label: 'مختبرات الروبوت' },
  { value: 'coding', label: 'البرمجة والخوارزميات' },
  { value: 'teamwork', label: 'فرق العمل والابتكار' },
  { value: 'stage', label: 'التقييم والجاهزية' }
];

const COLOR_OPTIONS = [
  { value: 'from-sky-500 to-blue-600', label: 'أزرق سماوي' },
  { value: 'from-purple-500 to-indigo-600', label: 'بنفسجي ملكي' },
  { value: 'from-emerald-500 to-teal-600', label: 'زمردي' },
  { value: 'from-amber-500 to-orange-600', label: 'ذهبي برتقالي' },
  { value: 'from-rose-500 to-pink-600', label: 'وردي' },
  { value: 'from-cyan-500 to-sky-600', label: 'سماوي فاتح' }
];

export default function CmsGalleryTab({
  marqueeForm,
  setMarqueeForm,
  galleryList,
  setGalleryList,
  handleSaveGallery,
  handleImageFileUpload,
  moveItem,
  isSaving
}) {
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'robotics',
    categoryLabel: 'مختبرات الروبوت',
    image: '',
    description: '',
    stats: 'توثيق نادي أبدع',
    color: 'from-sky-500 to-blue-600',
    showInMarquee: true
  });

  const marqueeVisibleCount = galleryList.filter((item) => item.showInMarquee !== false).length;

  const handleAddPhoto = () => {
    if (!newPhoto.title.trim() || !newPhoto.image.trim()) return;
    const catObj = CATEGORY_OPTIONS.find((c) => c.value === newPhoto.category) || CATEGORY_OPTIONS[0];
    const updated = [
      {
        ...newPhoto,
        id: Date.now(),
        title: newPhoto.title.trim(),
        categoryLabel: newPhoto.categoryLabel.trim() || catObj.label,
        description:
          newPhoto.description.trim() || 'لقطة توثيقية من أنشطة وورش نادي أبدع للمهارات الذكية.',
        showInMarquee: newPhoto.showInMarquee !== false
      },
      ...galleryList
    ];
    setGalleryList(updated);
    setNewPhoto({
      title: '',
      category: 'robotics',
      categoryLabel: 'مختبرات الروبوت',
      image: '',
      description: '',
      stats: 'توثيق نادي أبدع',
      color: 'from-sky-500 to-blue-600',
      showInMarquee: true
    });
    // حفظ ونشر فوري سحابياً عند الإضافة
    handleSaveGallery(updated, marqueeForm);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
        <div>
          <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
            إدارة «شريط اللحظات الملهمة» ومعرض الصور ({galleryList.length} صورة • {marqueeVisibleCount} بالشريط المتحرك)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تحكم كامل بنصوص الشريط المتحرك بالرئيسية («لقطات حية ومباشرة من مختبرات أبدع») مع إضافة وتعديل وحذف وترتيب الصور سحابياً.
          </p>
        </div>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => handleSaveGallery(galleryList, marqueeForm)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'جارٍ النشر السحابي...' : 'حفظ ونشر الشريط والمعرض سحابياً'}</span>
        </button>
      </div>

      {/* Marquee Section Header Settings */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/70 border border-indigo-200 dark:border-slate-700 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h5 className="text-xs sm:text-sm font-black text-indigo-900 dark:text-indigo-300 font-alexandria flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>نصوص وإعدادات قسم الشريط المتحرك في الصفحة الرئيسية</span>
          </h5>
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={marqueeForm?.enabled !== false}
              onChange={(e) => setMarqueeForm({ ...marqueeForm, enabled: e.target.checked })}
              className="accent-sky-600"
            />
            <span>إظهار الشريط المتحرك في الرئيسية</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
              الشارة العلوية (فوق العنوان)
            </label>
            <input
              type="text"
              value={marqueeForm?.badge || ''}
              onChange={(e) => setMarqueeForm({ ...marqueeForm, badge: e.target.value })}
              placeholder="لقطات حية ومباشرة من مختبرات أبدع"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
              عنوان قسم الشريط المتحرك
            </label>
            <input
              type="text"
              value={marqueeForm?.title || ''}
              onChange={(e) => setMarqueeForm({ ...marqueeForm, title: e.target.value })}
              placeholder="شريط اللحظات الملهمة وصناعة الأبطال"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-1">
              النص التوضيحي الجانبي
            </label>
            <input
              type="text"
              value={marqueeForm?.hint || ''}
              onChange={(e) => setMarqueeForm({ ...marqueeForm, hint: e.target.value })}
              placeholder="حرك الفأرة لإيقاف الشريط • اضغط على أي صورة لتكبيرها"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Add New Photo Form */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 space-y-3">
        <h5 className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-300 font-alexandria flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>إضافة لقطة / صورة جديدة للشريط المتحرك والمعرض</span>
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            value={newPhoto.title}
            onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
            placeholder="عنوان اللقطة *"
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
          <select
            value={newPhoto.category}
            onChange={(e) => {
              const found = CATEGORY_OPTIONS.find((c) => c.value === e.target.value);
              setNewPhoto({
                ...newPhoto,
                category: e.target.value,
                categoryLabel: found ? found.label : newPhoto.categoryLabel
              });
            }}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newPhoto.categoryLabel}
            onChange={(e) => setNewPhoto({ ...newPhoto, categoryLabel: e.target.value })}
            placeholder="الوسم الظاهر أعلى البطاقة (مثال: مختبر الروبوت)"
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
          <label className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black text-center cursor-pointer transition flex items-center justify-center">
            {newPhoto.image ? 'تم اختيار الصورة ✓' : '📷 رفع صورة من الجهاز'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageFileUpload(
                  e.target.files?.[0],
                  (dataUrl) => setNewPhoto((prev) => ({ ...prev, image: dataUrl })),
                  960
                )
              }
            />
          </label>
          <input
            type="text"
            value={newPhoto.image}
            onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.value })}
            placeholder="أو الصق رابط الصورة (/gallery/... أو https://...) *"
            className="sm:col-span-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300"
          />
          <input
            type="text"
            value={newPhoto.description}
            onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
            placeholder="وصف مختصر يظهر أسفل الصورة"
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
          />
          <button
            type="button"
            disabled={isSaving || !newPhoto.title.trim() || !newPhoto.image.trim()}
            onClick={handleAddPhoto}
            className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition cursor-pointer"
          >
            + إضافة ونشر الآن
          </button>
        </div>
      </div>

      {/* Existing Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {galleryList.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex gap-3 items-start"
          >
            <div className="w-24 h-24 rounded-xl bg-slate-200 dark:bg-slate-900 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700 flex items-center justify-center relative">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => {
                  const copy = [...galleryList];
                  copy[idx] = { ...copy[idx], title: e.target.value };
                  setGalleryList(copy);
                }}
                placeholder="عنوان اللقطة"
                className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={item.categoryLabel || ''}
                  onChange={(e) => {
                    const copy = [...galleryList];
                    copy[idx] = { ...copy[idx], categoryLabel: e.target.value };
                    setGalleryList(copy);
                  }}
                  placeholder="وسم الشارة (مثال: مختبر الروبوت)"
                  className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-sky-700 dark:text-sky-300"
                />
                <select
                  value={item.color || 'from-sky-500 to-blue-600'}
                  onChange={(e) => {
                    const copy = [...galleryList];
                    copy[idx] = { ...copy[idx], color: e.target.value };
                    setGalleryList(copy);
                  }}
                  className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300"
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      لون الشريط: {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                rows={2}
                value={item.description || ''}
                onChange={(e) => {
                  const copy = [...galleryList];
                  copy[idx] = { ...copy[idx], description: e.target.value };
                  setGalleryList(copy);
                }}
                placeholder="وصف اللقطة"
                className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300"
              />
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 dark:text-emerald-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.showInMarquee !== false}
                    onChange={(e) => {
                      const copy = [...galleryList];
                      copy[idx] = { ...copy[idx], showInMarquee: e.target.checked };
                      setGalleryList(copy);
                    }}
                    className="accent-emerald-600"
                  />
                  <span>عرض بالشريط المتحرك</span>
                </label>
                <label className="px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-black cursor-pointer hover:bg-sky-200 transition">
                  تغيير الصورة
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageFileUpload(
                        e.target.files?.[0],
                        (dataUrl) => {
                          const copy = [...galleryList];
                          copy[idx] = { ...copy[idx], image: dataUrl };
                          setGalleryList(copy);
                        },
                        960
                      )
                    }
                  />
                </label>
                <input
                  type="text"
                  value={item.image || ''}
                  onChange={(e) => {
                    const copy = [...galleryList];
                    copy[idx] = { ...copy[idx], image: e.target.value };
                    setGalleryList(copy);
                  }}
                  className="flex-1 min-w-[120px] px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 shrink-0">
              <button
                type="button"
                onClick={() => moveItem(galleryList, setGalleryList, idx, -1)}
                className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-200 transition cursor-pointer"
                title="تحريك للأعلى"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveItem(galleryList, setGalleryList, idx, 1)}
                className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-200 transition cursor-pointer"
                title="تحريك للأسفل"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setGalleryList(galleryList.filter((_, i) => i !== idx))}
                className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-300 transition cursor-pointer"
                title="حذف الصورة"
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
