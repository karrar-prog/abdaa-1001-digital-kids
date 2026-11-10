import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { Building2, HeartHandshake, Handshake, Award } from 'lucide-react';

export default function PartnersSection({ onOpenVolunteerSponsor }) {
  const strategicPartners = EVENT_DETAILS.strategicPartners || [];
  const allSponsors = EVENT_DETAILS.partners || [];
  const featuredSponsors = allSponsors.filter((s) => s.featured);
  const regularSponsors = allSponsors.filter((s) => !s.featured);

  return (
    <section id="partners" className="py-16 sm:py-24 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-sky-700 dark:text-sky-300 tracking-wider uppercase bg-sky-50/80 dark:bg-sky-950/70 px-4 py-1.5 rounded-full border border-sky-200 dark:border-sky-800 inline-flex items-center gap-1.5 shadow-xs">
            <Handshake className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>الشراكة الاستراتيجية ورعاة الاحتفالية</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3 font-alexandria">
            شركاء المبادرة ورعاة الحفل
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2.5 px-2 leading-relaxed">
            تُقام مبادرة «1001» طفل رقمي بشراكة استراتيجية وتنفيذية بين <strong>نادي أبدع للمهارات الذكية</strong> و<strong>شركة المصدر لتكنولوجيا المعلومات</strong>، وبرعاية كريمة من المؤسسات والجهات الراعية في النجف الأشرف والعراق.
          </p>
        </div>

        {/* ==============================================================
            TIER 1: الشركاء الرئيسيون للمبادرة (نادي أبدع + شركة المصدر)
           ============================================================== */}
        <div className="mb-14">
          <div className="flex items-center justify-between gap-4 mb-5 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-sm">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-alexandria font-black text-slate-900 dark:text-white">
                  الشركاء الرئيسيون للمبادرة (Partners)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  الشراكة المؤسسية والتقنية المنظمة لمبادرة «1001» طفل رقمي
                </p>
              </div>
            </div>

            {onOpenVolunteerSponsor && (
              <button
                type="button"
                onClick={onOpenVolunteerSponsor}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm transition cursor-pointer btn-playful"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>انضم كراعٍ أو متطوع</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategicPartners.map((sp, idx) => (
              <div
                key={idx}
                className="frosted-glass rounded-3xl p-6 sm:p-8 border-2 border-sky-300/80 dark:border-sky-500/40 relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right"
              >
                {/* Logo Box */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white dark:bg-slate-900 p-3.5 border-2 border-sky-200 dark:border-slate-700 shadow-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src={sp.logo}
                    alt={sp.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Partner Info */}
                <div className="flex-1 space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[11px] font-black shadow-xs">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>{sp.badge}</span>
                  </div>

                  <h4 className="font-alexandria font-black text-lg sm:text-xl text-slate-900 dark:text-white leading-snug">
                    {sp.name}
                  </h4>

                  <div className="text-xs sm:text-sm font-extrabold text-sky-700 dark:text-sky-300">
                    {sp.role}
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {sp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==============================================================
            TIER 2: الرعاة والداعمون (مجموعة الياسر + شركة الغدير + الأميرات ثم باقي الرعاة)
           ============================================================== */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-6 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-alexandria font-black text-slate-900 dark:text-white">
                  الرعاة والداعمون (Sponsors & Supporters)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  المؤسسات والشركات الراعية والداعمة لتكريم الـ 170 خريجاً ومعرض الـ 40 ابتكاراً
                </p>
              </div>
            </div>
          </div>

          {/* الصف الأول المميز: مجموعة الياسر + شركة الغدير + مجمع الأميرات */}
          {featuredSponsors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-7">
              {featuredSponsors.map((sponsor, idx) => (
                <div
                  key={idx}
                  className="frosted-glass rounded-3xl p-5 sm:p-6 border-2 border-amber-300/85 dark:border-amber-500/40 text-center flex flex-col items-center justify-between group hover:-translate-y-1.5 transition-all duration-300 shadow-lg"
                >
                  <div className="w-full flex flex-col items-center">
                    <div className="w-full h-32 sm:h-36 rounded-2xl bg-white p-4 border border-amber-200/80 dark:border-slate-700 flex items-center justify-center mb-4 group-hover:scale-[1.03] transition-transform overflow-hidden shadow-sm">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-1 font-alexandria leading-snug">
                      {sponsor.name}
                    </h4>
                  </div>

                  <span className="text-[11px] sm:text-xs font-extrabold px-3.5 py-1 rounded-full mt-2.5 inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                    <Award className="w-3.5 h-3.5 text-amber-100" />
                    <span>{sponsor.role}</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* باقي الرعاة والداعمين */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {regularSponsors.map((sponsor, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-between group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-full flex flex-col items-center">
                  {/* Sponsor Logo Container */}
                  <div className="w-full h-24 sm:h-28 rounded-2xl bg-white p-3 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform overflow-hidden shadow-xs">
                    {sponsor.logo ? (
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl flex items-center justify-center text-amber-500">
                        <Building2 className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Sponsor Name */}
                  <h4 className="text-xs sm:text-[13px] font-extrabold text-slate-900 dark:text-white mb-1 font-alexandria leading-snug">
                    {sponsor.name}
                  </h4>
                </div>

                {/* Sponsor Badge */}
                <span
                  className={`text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-full mt-2.5 block ${
                    sponsor.highlight
                      ? 'bg-amber-100/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : 'text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {sponsor.role}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
