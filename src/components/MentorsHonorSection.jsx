import React, { useState, useMemo, useEffect } from 'react';
import {
  Award,
  Printer,
  Search,
  CheckCircle2,
  Cpu,
  Bot,
  ShieldCheck,
  Code2,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';
import { openMentorCertificatePrintWindow } from '../utils/printEngine';
import { generateOfficialQrDataUrl } from '../utils/qrVerify';
import { playClickPop, playSuccessChime } from '../utils/soundEffects';

export const HONOROLL_MENTORS = [
  {
    id: 'MNT-2026-01',
    name: 'أ. فراس نزار كريم',
    role: 'المشرف العام للمبادرة',
    specialty: 'هندسة البرمجيات والذكاء الاصطناعي التطبيقي',
    cohortTitle: 'إشراف عام — الدفعة الأولى (10 كروبات)',
    ageFocus: '7 – 14 سنة',
    hours: '240+ ساعة إشراف وتدريب',
    projectsCount: 40,
    badgeColor: 'amber',
    category: 'قيادة وإشراف'
  },
  {
    id: 'MNT-2026-02',
    name: 'م. حيدر الكفيشي',
    role: 'مشرف كروب الخوارزمي (G01)',
    specialty: 'البرمجة باللبنات (Scratch) والمنطق الحاسوبي',
    cohortTitle: 'كروب الخوارزمي — الأعمار 7–9 سنوات',
    ageFocus: '7 – 9 سنوات',
    hours: '120 ساعة تدريبية',
    projectsCount: 4,
    badgeColor: 'sky',
    category: 'برمجة الصغار'
  },
  {
    id: 'MNT-2026-03',
    name: 'م. زينب الموسوي',
    role: 'مشرفة كروب ابن الهيثم (G02)',
    specialty: 'تطوير الألعاب التفاعلية والقصص الرقمية',
    cohortTitle: 'كروب ابن الهيثم — الأعمار 7–9 سنوات',
    ageFocus: '7 – 9 سنوات',
    hours: '120 ساعة تدريبية',
    projectsCount: 4,
    badgeColor: 'sky',
    category: 'برمجة الصغار'
  },
  {
    id: 'MNT-2026-04',
    name: 'م. علي الشمري',
    role: 'مشرف كروب الكندي (G03)',
    specialty: 'الذكاء الاصطناعي المبسط وتعلم الآلة للأطفال',
    cohortTitle: 'كروب الكندي — الأعمار 7–9 سنوات',
    ageFocus: '7 – 9 سنوات',
    hours: '120 ساعة تدريبية',
    projectsCount: 4,
    badgeColor: 'emerald',
    category: 'ذكاء اصطناعي'
  },
  {
    id: 'MNT-2026-05',
    name: 'م. فاطمة الخفاجي',
    role: 'مشرفة كروب الجزري (G04)',
    specialty: 'هندسة الروبوتات التعليمية والمستشعرات الذكية',
    cohortTitle: 'كروب الجزري — الأعمار 10–11 سنة',
    ageFocus: '10 – 11 سنة',
    hours: '130 ساعة تدريبية',
    projectsCount: 4,
    badgeColor: 'amber',
    category: 'روبوتات وإلكترونيات'
  },
  {
    id: 'MNT-2026-06',
    name: 'م. مرتضى الفتلاوي',
    role: 'مشرف كروب الفارابي (G05)',
    specialty: 'الأنظمة المدمجة (Arduino) وإنترنت الأشياء',
    cohortTitle: 'كروب الفارابي — الأعمار 10–11 سنة',
    ageFocus: '10 – 11 سنة',
    hours: '130 ساعة تدريبية',
    projectsCount: 4,
    badgeColor: 'amber',
    category: 'روبوتات وإلكترونيات'
  },
  {
    id: 'MNT-2026-07',
    name: 'م. نور الهدى العبدلي',
    role: 'مشرفة كروب الرازي (G06)',
    specialty: 'تصميم التطبيقات الذكية وواجهات المستخدم للأطفال',
    cohortTitle: 'كروب الرازي — الأعمار 10–11 سنة',
    ageFocus: '10 – 11 سنة',
    hours: '125 ساعة تدريبية',
    projectsCount: 4,
    badgeColor: 'sky',
    category: 'برمجة الصغار'
  },
  {
    id: 'MNT-2026-08',
    name: 'م. محمد باقر الحكيم',
    role: 'مشرف كروب ابن سينا (G07)',
    specialty: 'التقنيات الطبية الذكية والذكاء الاصطناعي التوليدي',
    cohortTitle: 'كروب ابن سينا — الأعمار 10–11 سنة',
    ageFocus: '10 – 11 سنة',
    hours: '135 ساعة تدريبية',
    projectsCount: 4,
    badgeColor: 'emerald',
    category: 'ذكاء اصطناعي'
  },
  {
    id: 'MNT-2026-09',
    role: 'مشرف كروب جابر بن حيان (G08)',
    name: 'م. حسين الياسري',
    specialty: 'برمجة Python وتطوير مواقع الويب للناشئة',
    cohortTitle: 'كروب جابر بن حيان — الأعمار 12–14 سنة',
    ageFocus: '12 – 14 سنة',
    hours: '140 ساعة تدريبية',
    projectsCount: 4,
    badgeColor: 'violet',
    category: 'أمن سيبراني وبايثون'
  },
  {
    id: 'MNT-2026-10',
    name: 'م. سارة الجنابي',
    role: 'مشرفة كروب البيروني (G09)',
    specialty: 'الرؤية الحاسوبية (Computer Vision) والبيئة الذكية',
    cohortTitle: 'كروب البيروني — الأعمار 12–14 سنة',
    ageFocus: '12 – 14 سنة',
    hours: '140 ساعة تدريبية',
    projectsCount: 4,
    badgeColor: 'emerald',
    category: 'ذكاء اصطناعي'
  },
  {
    id: 'MNT-2026-11',
    name: 'م. كرار العيساوي',
    role: 'مشرف كروب الإدريسي (G10)',
    specialty: 'الأمن السيبراني والأخلاق الرقمية وحماية البيانات',
    cohortTitle: 'كروب الإدريسي — الأعمار 12–14 سنة',
    ageFocus: '12 – 14 سنة',
    hours: '145 ساعة تدريبية',
    projectsCount: 4,
    badgeColor: 'violet',
    category: 'أمن سيبراني وبايثون'
  },
  {
    id: 'MNT-2026-12',
    name: 'م. أحمد الحسيني',
    role: 'مدرب مختبر الروبوتات المتقدم',
    specialty: 'معايرة الحساسات وتصميم الهياكل الميكانيكية',
    cohortTitle: 'مختبر الروبوتات المركزي — نادي أبدع',
    ageFocus: '7 – 14 سنة',
    hours: '110 ساعات مختبرية',
    projectsCount: 12,
    badgeColor: 'amber',
    category: 'روبوتات وإلكترونيات'
  },
  {
    id: 'MNT-2026-13',
    name: 'م. زهراء الطالقاني',
    role: 'مدربة التفكير التصميمي والابتكار',
    specialty: 'تحويل أفكار الأطفال إلى نماذج أولية (Prototyping)',
    cohortTitle: 'حاضنة مشاريع معرض الـ 40 ابتكاراً',
    ageFocus: '7 – 14 سنة',
    hours: '115 ساعة إشرافية',
    projectsCount: 15,
    badgeColor: 'sky',
    category: 'قيادة وإشراف'
  },
  {
    id: 'MNT-2026-14',
    name: 'م. مصطفى الغراوي',
    role: 'مدرب مختبر الذكاء الاصطناعي',
    specialty: 'تطبيقات التعرف الصوتي والصوري للأطفال',
    cohortTitle: 'مختبر الذكاء الاصطناعي — الدفعة الأولى',
    ageFocus: '10 – 14 سنة',
    hours: '110 ساعات تدريبية',
    projectsCount: 10,
    badgeColor: 'emerald',
    category: 'ذكاء اصطناعي'
  },
  {
    id: 'MNT-2026-15',
    name: 'أ. رقية الكعبي',
    role: 'منسقة الإرشاد التربوي والنفسي للطفل',
    specialty: 'بناء الثقة بالنفس ومهارات الإلقاء على المسرح',
    cohortTitle: 'برنامج المتحدث التقني الصغير (Pitching)',
    ageFocus: '7 – 14 سنة',
    hours: '100 ساعة تدريبية',
    projectsCount: 20,
    badgeColor: 'sky',
    category: 'قيادة وإشراف'
  },
  {
    id: 'MNT-2026-16',
    name: 'م. سجاد الزبيدي',
    role: 'مدرب تطوير الويب والأمن الرقمي',
    specialty: 'واجهات HTML/CSS/JS وحماية الحسابات المدرسية',
    cohortTitle: 'مسار القائد التقني (12–14 سنة)',
    ageFocus: '12 – 14 سنة',
    hours: '105 ساعات تدريبية',
    projectsCount: 8,
    badgeColor: 'violet',
    category: 'أمن سيبراني وبايثون'
  },
  {
    id: 'MNT-2026-17',
    name: 'م. حنين المحنة',
    role: 'مدربة البرمجة الإبداعية للصغار',
    specialty: 'تطوير الألعاب التعليمية التفاعلية بـ Scratch 3',
    cohortTitle: 'مسار المستكشف الرقمي (7–9 سنوات)',
    ageFocus: '7 – 9 سنوات',
    hours: '105 ساعات تدريبية',
    projectsCount: 10,
    badgeColor: 'sky',
    category: 'برمجة الصغار'
  },
  {
    id: 'MNT-2026-18',
    name: 'م. باقر الشيباني',
    role: 'مهندس دعم الدوائر الإلكترونية و IoT',
    specialty: 'ربط المتحكمات الدقيقة بالطاقة الشمسية والمستشعرات',
    cohortTitle: 'معرض الابتكارات الهندسية — 40 مشروعاً',
    ageFocus: '10 – 14 سنة',
    hours: '115 ساعة مختبرية',
    projectsCount: 14,
    badgeColor: 'amber',
    category: 'روبوتات وإلكترونيات'
  },
  {
    id: 'MNT-2026-19',
    name: 'م. غدير الصدر',
    role: 'مدربة الخوارزميات والمنطق الرياضي',
    specialty: 'حل المشكلات البرمجية (Problem Solving) للناشئة',
    cohortTitle: 'مسار البنّاء المبتكر (10–11 سنة)',
    ageFocus: '10 – 11 سنة',
    hours: '100 ساعة تدريبية',
    projectsCount: 8,
    badgeColor: 'emerald',
    category: 'ذكاء اصطناعي'
  },
  {
    id: 'MNT-2026-20',
    name: 'م. منتظر الخزعلي',
    role: 'مشرف التوثيق الرقمي والمنصة التفاعلية',
    specialty: 'إدارة المعرض التقني وتوثيق مشاريع التخرج',
    cohortTitle: 'اللجنة التنظيمية والتقنية للاحتفالية',
    ageFocus: '7 – 14 سنة',
    hours: '130 ساعة تنظيمية',
    projectsCount: 40,
    badgeColor: 'violet',
    category: 'قيادة وإشراف'
  }
];

const CATEGORIES = [
  'الكل',
  'قيادة وإشراف',
  'برمجة الصغار',
  'روبوتات وإلكترونيات',
  'ذكاء اصطناعي',
  'أمن سيبراني وبايثون'
];

export const MENTORS_CMS_KEY = 'abdaa_cms_mentors_v1';

export function getActiveMentorsList() {
  if (typeof window === 'undefined') return HONOROLL_MENTORS;
  try {
    const raw = localStorage.getItem(MENTORS_CMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return HONOROLL_MENTORS;
}

export function saveActiveMentorsList(list) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MENTORS_CMS_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('abdaa-cms-updated'));
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
      const matchesCategory = activeCategory === 'الكل' || m.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.specialty.toLowerCase().includes(q) ||
        m.cohortTitle.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q);
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
        track: mentor.specialty,
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
            <span>لوحة شرف الأساتذة والمدربين المشرفين • 20 مدرباً ومشرفاً</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-alexandria font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            صُنّاع الأثر خلف <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-sky-600">170 مبتكراً صغيراً</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            تحية اعتزاز وتقدير لنخبة المهندسين والمدربين الذين رافقوا أطفالنا (من عمر 7 إلى 14 سنة) طوال أشهر التدريب العملي لإنجاز 40 مشروعاً تقنياً، مع إمكانية طباعة شهادة الشكر والتقدير الرسمية (A4) لكل مدرب فوراً.
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
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المدرب أو الكروب..."
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
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-sky-600 p-0.5 shadow-md shrink-0">
                    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center font-alexandria font-black text-base text-amber-600 dark:text-amber-400">
                      {mentor.name.replace('أ. ', '').replace('م. ', '').slice(0, 2)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-alexandria font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {mentor.name}
                    </h3>
                    <p className="text-xs font-bold text-sky-600 dark:text-sky-400">
                      {mentor.role}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {mentor.specialty}
                </p>

                <div className="space-y-1.5 text-[11.5px] text-slate-600 dark:text-slate-400 mb-4">
                  <div className="flex items-center justify-between">
                    <span>الكروب / المهمة:</span>
                    <strong className="text-slate-800 dark:text-slate-200 truncate max-w-[155px]">{mentor.cohortTitle}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الفئة العمرية:</span>
                    <strong className="text-amber-600 dark:text-amber-400">{mentor.ageFocus}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الساعات التدريبية:</span>
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
