import React from 'react';
import { EVENT_DETAILS, getActiveProjects } from '../data/eventData';
import { Phone, Mail, MapPin, Ticket, QrCode, Gift, HeartHandshake, GraduationCap, Award, Tv, ShieldCheck } from 'lucide-react';
import MasdarBadge from './MasdarBadge';

export default function Footer({
  onOpenRSVP,
  onOpenChecker,
  onOpenVolunteerSponsor,
  onOpenRaffle,
  onOpenBatch2,
  onOpenJudgingPortal,
  onOpenStagePresentation,
  onOpenAdmin
}) {
  const { contact } = EVENT_DETAILS;
  const projectsCount = getActiveProjects().length;

  return (
    <footer className="bg-gradient-to-b from-sky-50/90 via-white to-slate-100/95 text-slate-800 pt-16 pb-24 relative z-10 text-right border-t border-sky-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-md border border-sky-200/80 shrink-0">
                <img src="/brand/abdaa-logo.png" alt="نادي أبدع للمهارات الذكية" className="w-full h-full object-contain" />
              </div>
              <div className="h-12 px-2.5 rounded-2xl bg-white border border-sky-200/80 flex items-center justify-center shadow-sm shrink-0">
                <img src="/brand/logo-1001-kids.png" alt="شعار مبادرة 1001 طفل رقمي" className="h-9 w-auto object-contain" />
              </div>
              <div>
                <h4 className="font-alexandria font-bold text-base text-slate-900">نادي أبدع للمهارات الذكية</h4>
                <p className="text-xs font-bold text-sky-700">النجف الأشرف – العراق (الأعمار 6 – 14 سنة)</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              مشروع تعليمي ومجتمعي يهدف لاكتشاف مواهب الأطفال من عمر 6 إلى 14 سنة في البرمجة والروبوتات والذكاء الاصطناعي، وإعداد جيل يصنع التكنولوجيا ولا يكتفي باستهلاكها.
            </p>

            <div className="text-xs font-bold text-amber-700">
              «{EVENT_DETAILS.slogan}»
            </div>

            <div className="pt-1">
              <MasdarBadge variant="default" labelText="الشريك المنظم" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="font-alexandria font-bold text-sm text-slate-900 border-r-2 border-sky-500 pr-2">
              أقسام المنصة
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li><a href="#hero" className="hover:text-sky-700 transition">الرئيسية وموعد الحفل</a></li>
              <li><a href="#story" className="hover:text-sky-700 transition">قصة أبدع وأبطال العرب</a></li>
              <li><a href="#graduates" className="hover:text-sky-700 transition">بطاقة الخريج وشهادة التخرج بـ QR</a></li>
              <li><a href="/frame" className="hover:text-pink-600 font-bold text-pink-700 transition">استوديو إطار التخرج الطفولي (8 ثيمات) 📸</a></li>
              <li><a href="#tracks" className="hover:text-sky-700 transition">المراحل العمرية (6–14) والمحاور</a></li>
              <li><a href="#projects" className="hover:text-sky-700 transition">معرض المشاريع الـ {projectsCount} ومعايير التقييم</a></li>
              <li><a href="#sponsors" className="hover:text-amber-600 font-bold text-amber-700 transition">الرعاة والشركاء الرسميون ({(EVENT_DETAILS.partners || []).length} راعياً)</a></li>
              <li><a href="#safety-faq" className="hover:text-sky-700 transition">ميثاق الأمان الرقمي والأسئلة الشائعة</a></li>
              <li><a href="#agenda" className="hover:text-sky-700 transition">برنامج فقرات الحفل</a></li>
            </ul>
          </div>

          {/* Official Contact Info */}
          <div className="space-y-3">
            <h5 className="font-alexandria font-bold text-sm text-slate-900 border-r-2 border-teal-500 pr-2">
              التواصل والاستعلام الرسمي
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="font-extrabold text-slate-900">
                {contact.leadName}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                <a href={`tel:${contact.phone}`} className="hover:text-sky-700 dir-ltr font-mono font-bold text-slate-700">{contact.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-sky-700 dir-ltr font-mono font-bold text-slate-700">{contact.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium">{EVENT_DETAILS.venue}</span>
              </li>
            </ul>
          </div>

          {/* Interactive Portals & Tools */}
          <div className="space-y-3">
            <h5 className="font-alexandria font-bold text-sm text-slate-900 border-r-2 border-amber-500 pr-2">
              البوابات التفاعلية للحفل
            </h5>

            <button
              onClick={onOpenRSVP}
              className={
                EVENT_DETAILS.rsvpClosed
                  ? 'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 font-bold text-xs transition cursor-pointer'
                  : 'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer'
              }
            >
              <Ticket className="w-4 h-4" />
              <span>{EVENT_DETAILS.rsvpClosed ? 'تم إغلاق حجز مقاعد الزوار' : 'حجز مقعد واستلام رمز QR'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              {onOpenBatch2 && (
                <button
                  onClick={() => onOpenBatch2(10)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px] transition cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                  <span>تسجيل الدفعة 2</span>
                </button>
              )}
              {onOpenJudgingPortal && (
                <button
                  onClick={() => onOpenJudgingPortal(null)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 font-bold text-[11px] shadow-xs transition cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  <span>بوابة التحكيم</span>
                </button>
              )}
              {onOpenStagePresentation && (
                <button
                  onClick={() => onOpenStagePresentation(0)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-emerald-700 font-bold text-[11px] shadow-xs transition cursor-pointer"
                >
                  <Tv className="w-3.5 h-3.5 text-emerald-500" />
                  <span>شاشة المسرح</span>
                </button>
              )}
              {onOpenRaffle && (
                <button
                  onClick={onOpenRaffle}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 text-amber-700 font-bold text-[11px] shadow-xs transition cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-500" />
                  <span>قرعة المسرح</span>
                </button>
              )}
              {onOpenChecker && (
                <button
                  onClick={onOpenChecker}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 text-sky-700 font-bold text-[11px] shadow-xs transition cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-sky-500" />
                  <span>فحص التذاكر</span>
                </button>
              )}
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] shadow-xs transition cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>لوحة الإدارة</span>
                </button>
              )}
            </div>

            {onOpenVolunteerSponsor && (
              <button
                onClick={onOpenVolunteerSponsor}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[11px] transition cursor-pointer"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                <span>انضم كشريك راعٍ أو متطوع</span>
              </button>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} المؤسس المنظم: نادي أبدع للمهارات الذكية — الشريك المنظم: شركة المصدر لتكنولوجيا المعلومات.</p>
          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <span>صُنع بشغف للاحتفاء بأطفال العراق (6 – 14 سنة) والمستقبل الرقمي</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
