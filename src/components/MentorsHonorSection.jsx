import React, { useState, useMemo, useEffect } from 'react';
import {
  Award,
  Printer,
  Search,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { openMentorCertificatePrintWindow } from '../utils/printEngine';
import { generateOfficialQrDataUrl } from '../utils/qrVerify';
import { playClickPop, playSuccessChime } from '../utils/soundEffects';
import {
  HONOROLL_MENTORS,
  MENTORS_CMS_KEY,
  getActiveMentorsList,
  saveActiveMentorsList,
  resetActiveMentorsList
} from '../data/mentorsData';

export { HONOROLL_MENTORS, MENTORS_CMS_KEY, getActiveMentorsList, saveActiveMentorsList, resetActiveMentorsList };

const CATEGORIES = [
  'الكل',
  'المؤسسون',
  'الشريك المنظم',
  'المدربون المتطوعون',
  'جامعة الفرات الأوسط التقنية',
  'شركة المصدر',
  'مدارس دار الزهراء الخيرية',
  'ديوان محافظة النجف الأشرف'
];

function getDisplayInitials(fullName = '') {
  const cleaned = String(fullName)
    .replace(/^(ر\.مبرمجين\.|أ\.م\.د\.|أ\.د\.|د\.|أ\.|م\.)\s*/g, '')
    .trim();
  return cleaned.slice(0, 2) || 'أب';
}

function getAvatarGradient(badgeColor) {
  switch (badgeColor) {
    case 'indigo':
      return 'from-indigo-600 via-sky-600 to-amber-500';
    case 'emerald':
      return 'from-emerald-500 via-teal-500 to-sky-600';
    case 'violet':
      return 'from-violet-500 via-purple-500 to-indigo-600';
    case 'sky':
      return 'from-sky-500 via-blue-500 to-indigo-600';
    default:
      return 'from-amber-500 via-orange-500 to-sky-600';
  }
}

export default function MentorsHonorSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [printingId, setPrintingId] = useState(null);
  const [mentorsList, setMentorsList] = useState(() => getActiveMentorsList());

  useEffect(() => {
    const refresh = () => setMentorsList(getActiveMentorsList());
    window.addEventListener('abdaa-cms-updated', refresh);
    return () => window.removeEventListener('abdaa-cms-updated', refresh);
  }, []);

  const filteredMentors = useMemo(() => {
    return mentorsList.filter((m) => {
      const orgText = m.organization || m.cohortTitle || '';
      const matchesCategory =
        activeCategory === 'الكل' ||
        m.category === activeCategory ||
        (activeCategory === 'المدربون المتطوعون' && String(m.role || '').includes('متطوع')) ||
        (activeCategory === 'جامعة الفرات الأوسط التقنية' && orgText.includes('جامعة الفرات الأوسط التقنية')) ||
        (activeCategory === 'شركة المصدر' && orgText.includes('شركة المصدر'));

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        String(m.name || '').toLowerCase().includes(q) ||
        String(m.role || '').toLowerCase().includes(q) ||
        String(orgText).toLowerCase().includes(q) ||
        String(m.specialty || '').toLowerCase().includes(q) ||
        String(m.cohortTitle || '').toLowerCase().includes(q) ||
        String(m.id || '').toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [mentorsList, searchQuery, activeCategory]);

  const handlePrintMentorCertificate = async (mentor) => {
    playClickPop();
    setPrintingId(mentor.id);
    try {
      const qrDataUrl = await generateOfficialQrDataUrl({
        type: 'mentor',
        code: mentor.id,
        name: mentor.name,
        role: mentor.role,
        track: mentor.organization || mentor.specialty,
        extra: mentor.cohortTitle
      }, 220);
      playSuccessChime();
      openMentorCertificatePrintWindow(mentor, qrDataUrl);
    } catch {
      openMentorCertificatePrintWindow(mentor, '');
    } finally {
      setPrintingId(null);
    }
  };

  return (
    <section id="mentors" className="py-20 bg-white dark:bg-slate-950 relative overflow-hidden border-t border-slate-200/70 dark:border-slate-800/80 transition-colors duration-300">
      {/* Subtle Clean Glow */}
      <div className="absolute top-12 left-10 w-80 h-80 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-10 w-80 h-80 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-extrabold mb-4 shadow-xs">
            <Award className="w-4 h-4 text-amber-500" />
            <span>لوحة شرف المؤسس المنظم والشريك المنظم والمدربين المتطوعين • {mentorsList.length} اسماً معتمداً</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-alexandria font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            صُنّاع الأثر خلف <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-sky-600">172 مبتكراً صغيراً</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            تحية اعتزاز وتقدير لمؤسسي نادي أبدع للمهارات الذكية — المؤسس المنظم (5 مؤسسين) وشركة المصدر — الشريك المنظم، والمدربين المتطوعين (20 مدرباً) من جامعة الفرات الأوسط التقنية، ديوان محافظة النجف الأشرف، مدارس دار الزهراء الخيرية، وشركة المصدر؛ مع إمكانية طباعة شهادة الشكر والتقدير الرسمية (A4) لكل منهم فوراً.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 frosted-glass p-4 rounded-3xl">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 justify-center md:justify-start">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playClickPop();
                    setActiveCategory(cat);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو جهة الانتساب أو الصفة..."
              className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="group glass-card rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Ribbon */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/90 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {mentor.id}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  معتمد 2026
                </span>
              </div>

              {/* Mentor Identity */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getAvatarGradient(mentor.badgeColor)} p-0.5 shadow-md shrink-0`}>
                    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center font-alexandria font-black text-base text-amber-600 dark:text-amber-400">
                      {getDisplayInitials(mentor.name)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-alexandria font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                      {mentor.name}
                    </h3>
                    <p className="text-xs font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                      {mentor.role}
                    </p>
                  </div>
                </div>

                {/* Official Organization / Affiliation from Excel */}
                <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed mb-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                  <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="font-bold">{mentor.organization || mentor.cohortTitle}</span>
                </div>

                <div className="space-y-1.5 text-[11.5px] text-slate-600 dark:text-slate-400 mb-4">
                  <div className="flex items-center justify-between gap-2">
                    <span>الصفة بالمبادرة:</span>
                    <strong className="text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{mentor.role}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span>الفئة المستهدفة:</span>
                    <strong className="text-amber-600 dark:text-amber-400">{mentor.ageFocus}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span>الدفعة:</span>
                    <strong className="text-sky-600 dark:text-sky-400">{mentor.hours}</strong>
                  </div>
                </div>
              </div>

              {/* Print Appreciation Certificate Button */}
              <button
                onClick={() => handlePrintMentorCertificate(mentor)}
                disabled={printingId === mentor.id}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-amber-500 dark:via-orange-500 dark:to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white dark:text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>
                  {printingId === mentor.id ? 'جاري تجهيز الشهادة...' : 'طباعة شهادة الشكر (A4)'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
