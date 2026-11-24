import React from 'react';
import { Save, RotateCcw, ShieldCheck, Lock, Unlock } from 'lucide-react';

export default function CmsGeneralTab({
  generalForm,
  setGeneralForm,
  statsList,
  setStatsList,
  handleSaveGeneralAndStats,
  handleResetAllCMS,
  isSaving
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-50/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-200/70 dark:border-slate-700">
        <div>
          <h4 className="font-alexandria font-black text-sm sm:text-base text-slate-900 dark:text-white">
            إعدادات الحفل الرئيسية والعد التنازلي وبيانات التواصل
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            أي تعديل هنا يُحفظ في قاعدة البيانات السحابية وينعكس فوراً على الواجهة الرئيسية (Hero)، العد التنازلي، والفوتر لكل الزوار.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetAllCMS}
            className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-extrabold flex items-center gap-1.5 hover:bg-rose-100 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveGeneralAndStats}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'جارٍ النشر السحابي...' : 'حفظ ونشر سحابياً فوراً'}</span>
          </button>
        </div>
      </div>

      {/* Visitor RSVP Registration Toggle Card */}
      <div
        className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          generalForm.rsvpClosed
            ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
            : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700'
        }`}
      >
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            {generalForm.rsvpClosed ? (
              <Lock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            ) : (
              <Unlock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            )}
            <strong className="text-xs sm:text-sm font-black font-alexandria text-slate-900 dark:text-white">
              حالة استمارة حجز مقاعد الزوار:{' '}
              <span className={generalForm.rsvpClosed ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'}>
                {generalForm.rsvpClosed ? 'مغلقة حالياً 🔒' : 'مفتوحة للحجز 🔓'}
              </span>
            </strong>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            عند الإغلاق يُمنع إصدار تذاكر جديدة وتظهر للزوار رسالة إغلاق رسمية (مع بقاء التذاكر السابقة سارية). لا تنسَ الضغط على «حفظ ونشر سحابياً فوراً».
          </p>
          {generalForm.rsvpClosed && (
            <input
              type="text"
              value={generalForm.rsvpClosedMessage || ''}
              onChange={(e) => setGeneralForm({ ...generalForm, rsvpClosedMessage: e.target.value })}
              placeholder="رسالة إغلاق استمارة الزوار..."
              className="mt-2 w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-xs font-bold text-slate-900 dark:text-white"
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => setGeneralForm({ ...generalForm, rsvpClosed: !generalForm.rsvpClosed })}
          className={`px-4 py-2.5 rounded-xl text-xs font-black shrink-0 shadow-sm transition cursor-pointer flex items-center gap-1.5 ${
            generalForm.rsvpClosed
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-rose-600 hover:bg-rose-500 text-white'
          }`}
        >
          {generalForm.rsvpClosed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>{generalForm.rsvpClosed ? 'إعادة فتح استمارة الزوار' : 'إغلاق استمارة الزوار الآن'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            عنوان الاحتفالية الرئيسي
          </label>
          <input
            type="text"
            value={generalForm.title || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            اسم المبادرة الفرعي
          </label>
          <input
            type="text"
            value={generalForm.subtitle || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, subtitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            عنوان الملتقى الرسمي
          </label>
          <input
            type="text"
            value={generalForm.forumTitle || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, forumTitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            اسم المؤسسة / النادي
          </label>
          <input
            type="text"
            value={generalForm.organization || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, organization: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            الشعار اللفظي (Slogan)
          </label>
          <input
            type="text"
            value={generalForm.slogan || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, slogan: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            الفئة العمرية المستهدفة
          </label>
          <input
            type="text"
            value={generalForm.targetAgeRange || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, targetAgeRange: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            نص الموعد الظاهر
          </label>
          <input
            type="text"
            value={generalForm.dateText || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, dateText: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            تاريخ ووقت العد التنازلي (ISO)
          </label>
          <input
            type="datetime-local"
            value={generalForm.eventDateISO?.slice(0, 16) || '2026-11-27T15:00'}
            onChange={(e) => setGeneralForm({ ...generalForm, eventDateISO: `${e.target.value}:00` })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            توقيت انطلاق الحفل
          </label>
          <input
            type="text"
            value={generalForm.time || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, time: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            مكان الحفل (القاعة)
          </label>
          <input
            type="text"
            value={generalForm.venue || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, venue: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            سعة القاعة
          </label>
          <input
            type="text"
            value={generalForm.capacity || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, capacity: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            اسم مسؤول التواصل / إدارة النادي
          </label>
          <input
            type="text"
            value={generalForm.leadName || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, leadName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            رقم الهاتف الرسمي
          </label>
          <input
            type="text"
            value={generalForm.phone || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
            البريد الإلكتروني الرسمي
          </label>
          <input
            type="text"
            value={generalForm.email || ''}
            onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-[11px] text-emerald-900 dark:text-emerald-200 leading-snug">
            <strong className="block font-black">كلمات المرور محمية سحابياً بـ SHA-256</strong>
            <span>يمكن تعديل كلمات مرور الحسابات بأمان من تبويب «اليوزرات والصلاحيات».</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards Editor */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <h4 className="font-alexandria font-black text-sm text-slate-900 dark:text-white mb-3">
          إدارة أرقام وبطاقات الإحصائيات الخمس (StatsBar)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {statsList.map((st, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2"
            >
              <input
                type="text"
                value={st.number}
                onChange={(e) => {
                  const copy = [...statsList];
                  copy[idx] = { ...copy[idx], number: e.target.value };
                  setStatsList(copy);
                }}
                placeholder="الرقم (مثال: 168)"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-black text-sky-600 text-center font-alexandria"
              />
              <input
                type="text"
                value={st.label}
                onChange={(e) => {
                  const copy = [...statsList];
                  copy[idx] = { ...copy[idx], label: e.target.value };
                  setStatsList(copy);
                }}
                placeholder="العنوان"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={st.desc}
                onChange={(e) => {
                  const copy = [...statsList];
                  copy[idx] = { ...copy[idx], desc: e.target.value };
                  setStatsList(copy);
                }}
                placeholder="الوصف الفرعي"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
