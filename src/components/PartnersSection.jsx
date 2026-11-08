import React from 'react';
import { EVENT_DETAILS } from '../data/eventData';
import { Building2, Sparkles, HeartHandshake } from 'lucide-react';
import MasdarBadge from './MasdarBadge';

export default function PartnersSection({ onOpenVolunteerSponsor }) {
  return (
    <section id="partners" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold text-sky-700 dark:text-sky-300 tracking-wider uppercase bg-sky-50 dark:bg-sky-950/60 px-3.5 py-1.5 rounded-full border border-sky-200 dark:border-sky-800 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>منظومة الرعاية الرسمية وشركاء النجاح</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3 font-alexandria">
            برعاية ودعم نقابة المبرمجين وشركة المصدر والمؤسسات الشريكة
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2 px-2 leading-relaxed">
            نعتز بالدعم والشراكة مع الهيئات الحكومية والتقنية والأكاديمية التي تسهم في رعاية المواهب العراقية (من 7 إلى 14 سنة) وصناعة جيل المستقبل.
          </p>
        </div>

        {/* Central Prestige Hub Bar (Adapted from Al-Farabi Committee Hub) */}
        <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-sky-200/90 dark:border-slate-800 shadow-md flex flex-col lg:flex-row items-center justify-between gap-5 text-right">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0">
              <img src="/logo.svg" alt="نادي أبدع" className="w-full h-full object-contain" />
            </div>
            <div>
              <strong className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-alexandria block">
                الجهات الرسمية والشركاء الداعمون لمبادرة «1001» طفل رقمي
              </strong>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                تكامل حكومي ونقابي وتقني لاحتضان 170 خريجاً و40 ابتكاراً طلابياً في النجف الأشرف
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <MasdarBadge labelText="الشريك التقني الرسمي" />
            {onOpenVolunteerSponsor && (
              <button
                type="button"
                onClick={onOpenVolunteerSponsor}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm transition cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>انضم كراعٍ أو متطوع</span>
              </button>
            )}
          </div>
        </div>

        {/* Partners & Sponsors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {EVENT_DETAILS.partners.map((partner, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-5 text-center flex flex-col items-center justify-between transition-all bg-white dark:bg-slate-900 border ${
                partner.highlight 
                  ? 'border-sky-300 dark:border-sky-700/80 shadow-md shadow-sky-500/5 hover:border-sky-500' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              } group hover:-translate-y-1`}
            >
              <div className="w-full flex flex-col items-center">
                
                {/* Logo Container */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 dark:bg-slate-800 p-2.5 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform overflow-hidden">
                  {partner.logo ? (
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl flex items-center justify-center text-slate-400">
                      <Building2 className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1 font-alexandria leading-snug">
                  {partner.name}
                </h3>
              </div>

              {/* Role Badge */}
              <span className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full mt-2.5 block ${
                partner.highlight 
                  ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                  : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
              }`}>
                {partner.role}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
