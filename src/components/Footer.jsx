import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { Phone, Mail, MapPin, Sparkles, Ticket, QrCode, Gift, HeartHandshake } from 'lucide-react';
import MasdarBadge from './MasdarBadge';

export default function Footer({ onOpenRSVP, onOpenChecker, onOpenVolunteerSponsor, onOpenRaffle }) {
  const { contact } = EVENT_DETAILS;

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-20 relative z-10 text-right border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-md">
                <img src="/logo.svg" alt="logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="font-alexandria font-bold text-base text-white">نادي أبدع للمهارات الذكية</h4>
                <p className="text-xs text-sky-400">النجف الأشرف – العراق (الأعمار 7 – 14 سنة)</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              مشروع تعليمي ومجتمعي يهدف لاكتشاف مواهب الأطفال من عمر 7 إلى 14 سنة في البرمجة والروبوتات والذكاء الاصطناعي، وإعداد جيل يصنع التكنولوجيا ولا يكتفي باستهلاكها.
            </p>

            <div className="text-xs font-semibold text-amber-400">
              «{EVENT_DETAILS.slogan}»
            </div>

            <div className="pt-1">
              <MasdarBadge variant="footer" labelText="الشريك التقني" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="font-alexandria font-bold text-sm text-white border-r-2 border-sky-500 pr-2">
              أقسام المنصة
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#hero" className="hover:text-white transition">الرئيسية وموعد الحفل</a></li>
              <li><a href="#story" className="hover:text-white transition">قصة أبدع وأبطال العرب</a></li>
              <li><a href="#graduates" className="hover:text-white transition">بطاقة الخريج وشهادة التخرج بـ QR</a></li>
              <li><a href="#tracks" className="hover:text-white transition">المراحل العمرية (7–14) والمحاور</a></li>
              <li><a href="#projects" className="hover:text-white transition">معرض المشاريع الـ 40 ومعايير التقييم</a></li>
              <li><a href="#safety-faq" className="hover:text-white transition">ميثاق الأمان الرقمي والأسئلة الشائعة</a></li>
              <li><a href="#agenda" className="hover:text-white transition">برنامج فقرات الحفل</a></li>
            </ul>
          </div>

          {/* Official Contact Info */}
          <div className="space-y-3">
            <h5 className="font-alexandria font-bold text-sm text-white border-r-2 border-teal-400 pr-2">
              التواصل والاستعلام الرسمي
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="font-semibold text-white">
                {contact.leadName}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${contact.phone}`} className="hover:text-white dir-ltr font-mono">{contact.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-white dir-ltr font-mono">{contact.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{EVENT_DETAILS.venue}</span>
              </li>
            </ul>
          </div>

          {/* Interactive Portals & Tools */}
          <div className="space-y-3">
            <h5 className="font-alexandria font-bold text-sm text-white border-r-2 border-amber-400 pr-2">
              البوابات التفاعلية للحفل
            </h5>
            
            <button
              onClick={onOpenRSVP}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>حجز مقعد واستلام رمز QR</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              {onOpenRaffle && (
                <button
                  onClick={onOpenRaffle}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-amber-300 font-bold text-[11px] transition cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>قرعة المسرح</span>
                </button>
              )}
              {onOpenChecker && (
                <button
                  onClick={onOpenChecker}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-sky-300 font-bold text-[11px] transition cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>فحص التذاكر</span>
                </button>
              )}
            </div>

            {onOpenVolunteerSponsor && (
              <button
                onClick={onOpenVolunteerSponsor}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-bold text-[11px] transition cursor-pointer"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                <span>انضم كشريك راعٍ أو متطوع</span>
              </button>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} نادي أبدع للمهارات الذكية — الشريك التقني: شركة المصدر لتكنولوجيا المعلومات.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>صُنع بشغف للاحتفاء بأطفال العراق (7 – 14 سنة) والمستقبل الرقمي</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>

      </div>
    </footer>
  );
}
