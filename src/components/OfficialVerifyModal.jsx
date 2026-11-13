import React from 'react';
import { ShieldCheck, CheckCircle2, X, Award, CreditCard, Ticket, GraduationCap } from 'lucide-react';

export default function OfficialVerifyModal({ verifiedDoc, onClose }) {
  if (!verifiedDoc) return null;

  const TypeIcon =
    verifiedDoc.type === 'ticket'
      ? Ticket
      : verifiedDoc.type === 'grad'
      ? GraduationCap
      : verifiedDoc.type === 'mentor'
      ? Award
      : CreditCard;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/70 shadow-[0_25px_70px_rgba(16,185,129,0.28)] overflow-hidden my-auto">
        {/* Top Official Verification Header */}
        <div className="bg-gradient-to-l from-emerald-900 via-teal-900 to-slate-900 text-white p-5 border-b-2 border-amber-400 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-emerald-400/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0 p-2.5">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[11px] font-black mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>وثيقة رسمية صحيحة ومصدّقة إلكترونياً</span>
              </div>
              <h3 className="text-base sm:text-lg font-black font-alexandria leading-snug">
                نظام التوثيق والمصادقة الرقمية الموحد
              </h3>
            </div>
          </div>
        </div>

        {/* Partner Logos Strip */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/brand/abdaa-logo.png" alt="نادي أبدع" className="h-9 w-auto object-contain" />
            <div className="text-right leading-tight">
              <span className="block text-xs font-black text-slate-900 dark:text-white font-alexandria">
                نادي أبدع للمهارات الذكية
              </span>
              <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400">
                مبادرة «1001» طفل رقمي
              </span>
            </div>
          </div>
          <div className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-xs">
            <img
              src="/brand/masdar-logo-full-clean.png"
              alt="شركة المصدر"
              className="h-7 w-auto object-contain"
            />
          </div>
        </div>

        {/* Verified Document Details */}
        <div className="p-5 sm:p-6 space-y-4 text-right">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-3">
            <TypeIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block">
                نوع الوثيقة المصدّقة:
              </span>
              <strong className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                {verifiedDoc.typeLabel}
              </strong>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                الاسم الكامل لصاحب الوثيقة
              </span>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-alexandria">
                {verifiedDoc.name}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 block">الرقم التسلسلي المعتمد</span>
                <strong className="font-mono text-xs sm:text-sm font-black text-sky-600 dark:text-sky-400">
                  {verifiedDoc.code}
                </strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 block">حالة الاعتماد</span>
                <strong className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                  سارية وفعّالة ✓
                </strong>
              </div>
            </div>

            {verifiedDoc.role && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 block">الصفة / الدرجة المعتمدة</span>
                <strong className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  {verifiedDoc.role}
                </strong>
              </div>
            )}

            {verifiedDoc.track && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 block">المسار العلمي / التخصص</span>
                <strong className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  {verifiedDoc.track}
                </strong>
              </div>
            )}

            {verifiedDoc.extra && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 block">بيانات إضافية</span>
                <strong className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {verifiedDoc.extra}
                </strong>
              </div>
            )}
          </div>

          {/* Official Dual Signatures */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dashed border-slate-300 dark:border-slate-700 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="block text-[10px] font-bold text-slate-500">إدارة نادي أبدع للمهارات الذكية</span>
              <strong className="block text-xs font-black text-slate-900 dark:text-white font-alexandria mt-0.5">
                فراس نزار كريم
              </strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="block text-[10px] font-bold text-slate-500">إدارة شركة المصدر لتكنولوجيا المعلومات</span>
              <strong className="block text-xs font-black text-slate-900 dark:text-white font-alexandria mt-0.5">
                كرار حساني جاسم
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-lg transition cursor-pointer"
          >
            الانتقال لتصفح المنصة الرسمية للحفل
          </button>
        </div>
      </div>
    </div>
  );
}
