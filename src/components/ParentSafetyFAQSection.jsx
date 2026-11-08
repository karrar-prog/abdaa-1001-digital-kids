import React, { useState } from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Award, 
  Sparkles, 
  ChevronDown, 
  HelpCircle, 
  Rocket, 
  Cpu, 
  GraduationCap,
  Ticket,
  Gift
} from 'lucide-react';
import MasdarBadge from './MasdarBadge';

export default function ParentSafetyFAQSection({ onOpenRSVP, onOpenVolunteerSponsor, onOpenRaffle }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <section id="safety-faq" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* PART 1: 3-Step Child Journey & Bento Institutional Trust Card (Inspired by Al-Farabi Launchpad) */}
        <div className="rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 text-white border border-sky-500/30 shadow-2xl relative overflow-hidden text-right">
          <div className="absolute -top-20 right-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/15">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>بيئة علمية وتربوية معتمدة للأعمار (7 – 14 سنة)</span>
                </span>
                <h2 className="text-2xl sm:text-4xl font-black font-alexandria leading-tight text-white">
                  رحلة الطفل في نادي أبدع.. <span className="text-amber-400">من الشغف إلى منصة التتويج</span>
                </h2>
                <p className="text-xs sm:text-base text-slate-300 mt-2.5 leading-relaxed">
                  منظومة متكاملة تجمع بين التدريب الهندسي والبرمجي الحديث، الرعاية التربوية الآمنة، والتوثيق الرسمي بالتعاون مع نقابة المبرمجين العراقيين وشركة المصدر.
                </p>
              </div>

              <div className="shrink-0">
                <MasdarBadge variant="footer" labelText="الشريك التقني والمنفذ" />
              </div>
            </div>

            {/* 3-Step Child Journey Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/15 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0 font-alexandria font-black">
                  01
                </div>
                <div>
                  <span className="text-[11px] font-bold text-sky-300 block">المرحلة الأولى</span>
                  <strong className="text-base font-extrabold font-alexandria text-white block mt-0.5">
                    اكتشاف الموهبة والفرز العمري
                  </strong>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    توزيع الأطفال علمياً ضمن 3 فئات (7–9، 10–11، 12–14 سنة) وتحديد شغفهم التقني.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/15 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0 font-alexandria font-black">
                  02
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-300 block">المرحلة الثانية</span>
                  <strong className="text-base font-extrabold font-alexandria text-white block mt-0.5">
                    التدريب العملي وبناء الابتكار
                  </strong>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    تحويل الأفكار إلى نماذج حية (روبوتات، ذكاء اصطناعي، وتطبيقات) بإشراف 20 مدرباً مختصاً.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/15 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 font-alexandria font-black">
                  03
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-300 block">المرحلة الثالثة</span>
                  <strong className="text-base font-extrabold font-alexandria text-white block mt-0.5">
                    المعرض الحي والتتويج الرسمي
                  </strong>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    عرض المشروع في قصر الثقافة واستلام درع التخرج وبطاقة Digital Kid والشهادات الثلاث.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Portals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <button
                type="button"
                onClick={onOpenRSVP}
                className="p-5 rounded-2xl bg-gradient-to-r from-sky-500/25 to-blue-600/25 hover:from-sky-500/35 hover:to-blue-600/35 border border-sky-400/40 text-right transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                      <Ticket className="w-5 h-5" />
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30">
                      للعائلات والضيوف
                    </span>
                  </div>
                  <h3 className="text-base font-black font-alexandria text-white">حجز مقعد في قاعة قصر الثقافة</h3>
                  <p className="text-xs text-slate-300 mt-1">اختر البلوك ورقم المقعد واستلم تذكرة الدخول الموثقة بـ QR.</p>
                </div>
                <span className="text-xs font-extrabold text-sky-300 mt-4 inline-flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                  <span>افتح خريطة القاعة الآن</span>
                  <span>←</span>
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenVolunteerSponsor}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-400/50 text-right transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
                      <HeartHandshake className="w-5 h-5" />
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30">
                      للشركات والمتطوعين
                    </span>
                  </div>
                  <h3 className="text-base font-black font-alexandria text-white">بوابة الرعاية والتطوع</h3>
                  <p className="text-xs text-slate-300 mt-1">انضم كشريك راعٍ للمواهب العراقية أو ضمن فريق التنظيم الميداني.</p>
                </div>
                <span className="text-xs font-extrabold text-amber-300 mt-4 inline-flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                  <span>تقديم طلب شراكة أو تطوع</span>
                  <span>←</span>
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenRaffle}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-emerald-400/50 text-right transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center">
                      <Gift className="w-5 h-5" />
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                      تفاعل المسرح المباشر
                    </span>
                  </div>
                  <h3 className="text-base font-black font-alexandria text-white">منصة القرعة وجوائز الحفل</h3>
                  <p className="text-xs text-slate-300 mt-1">نظام السحب العشوائي المباشر لتكريم المشاريع المتميزة وتذاكر الحضور.</p>
                </div>
                <span className="text-xs font-extrabold text-emerald-300 mt-4 inline-flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                  <span>استعراض منصة السحب التفاعلي</span>
                  <span>←</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* PART 2: Digital Child Safety Charter & Parent FAQs (2-Column Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-right">
          
          {/* Right Column: Safety & Educational Governance Charter */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>ميثاق الأمان الرقمي والبيئة التربوية</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-alexandria leading-snug">
                لماذا يثق أولياء الأمور والمؤسسات التربوية بنادي أبدع؟
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                لأننا نتعامل مع الفئة العمرية (7 إلى 14 سنة) بأعلى معايير الأمان التربوي والرقمي، ونحول شغفهم بالتقنية إلى مهارات رصينة وموثقة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EVENT_DETAILS.safetyPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 font-alexandria font-black text-xs">
                    0{idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-alexandria mb-1.5">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Left Column: Parent FAQs Accordion */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-3">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>دليل أولياء الأمور والزوار</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-alexandria leading-snug">
                الأسئلة الشائعة حول المبادرة والحفل
              </h3>
            </div>

            <div className="space-y-3 pt-1">
              {EVENT_DETAILS.parentFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isOpen
                        ? 'bg-sky-50/40 dark:bg-slate-800/70 border-sky-300 dark:border-sky-700 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-alexandria leading-snug">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-sky-600 dark:text-sky-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
