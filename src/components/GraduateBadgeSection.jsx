import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Search, 
  Printer, 
  Sparkles, 
  Award, 
  Share2, 
  UserCheck, 
  GraduationCap,
  Cpu,
  ShieldCheck,
  FileBadge,
  Tv
} from 'lucide-react';
import { openGraduateBadgePrintWindow, openGraduateCertificatePrintWindow } from '../utils/printEngine';
import { ALL_170_GRADUATES, GRADUATION_COHORTS } from '../data/cohortsData';

const GRADUATES_DATABASE = [
  {
    id: 'ABDA3-DK00-000001',
    initiativeCode: '1001-0001',
    name: 'رضا فراس نزار',
    ageGroup: '12 - 14 سنة',
    track: 'الروبوت والذكاء الاصطناعي',
    project: 'نظام الذكاء الاصطناعي للكشف المبكر',
    grade: 'امتياز مع مرتبة الشرف الأولى',
    year: '2026',
    cohortNumber: 1
  },
  ...ALL_170_GRADUATES
];

export default function GraduateBadgeSection({ onOpenStagePresentation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCohortNum, setSelectedCohortNum] = useState(1);
  const [selectedGraduate, setSelectedGraduate] = useState(GRADUATES_DATABASE[0]);
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const activeGraduate = selectedGraduate || (searchTerm.trim() ? {
    id: 'ABDA3-DK00-100170',
    initiativeCode: '1001-0170',
    name: searchTerm.trim(),
    ageGroup: '7 - 14 سنة',
    track: 'مسار التميز التقني والابتكار',
    project: 'مشروع تخرج الدفعة الأولى 2026',
    grade: 'امتياز مع مرتبة الشرف',
    year: '2026'
  } : GRADUATES_DATABASE[0]);

  useEffect(() => {
    let isMounted = true;
    const buildQr = async () => {
      try {
        const payload = JSON.stringify({
          id: activeGraduate.id,
          code: activeGraduate.initiativeCode,
          name: activeGraduate.name,
          track: activeGraduate.track,
          org: 'Abdaa Smart Skills Club - 1001 Digital Kids'
        });
        const dataUrl = await QRCode.toDataURL(payload, {
          width: 220,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        });
        if (isMounted) setQrUrl(dataUrl);
      } catch {
        // ignore
      }
    };
    buildQr();
    return () => { isMounted = false; };
  }, [activeGraduate.id, activeGraduate.initiativeCode, activeGraduate.name, activeGraduate.track]);

  const handlePrintBadge = () => {
    openGraduateBadgePrintWindow(activeGraduate, qrUrl);
  };

  const handlePrintCertificate = () => {
    openGraduateCertificatePrintWindow(activeGraduate, qrUrl);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#graduates?id=${activeGraduate.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="graduates" className="py-20 bg-gradient-to-b from-slate-100/80 via-white to-slate-100/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-y border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-sky-400/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-bold text-xs shadow-sm mb-4">
            <Award className="w-4 h-4 text-amber-500" />
            <span>السجل الرقمي المعتمد للدفعة الأولى (الأعمار 7 – 14 سنة)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-alexandria tracking-tight">
            بطاقة الخريج وشهادة التخرج الموثقة بـ QR
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-tajawal leading-relaxed">
            استعرض واطبع بطاقة عضوية طفلك الرقمية وشهادة التخرج الرسمية المعتمدة من مبادرة «1001» طفل رقمي ونادي أبدع وشركة المصدر ونقابة المبرمجين.
          </p>
        </div>

        {/* Main Grid: Search & Controls (Left) + Interactive Card Render (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6 text-right">
            
            {/* Search Box Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)]">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                البحث بالاسم أو كود العضوية (أو اكتب اسم طفلك للتجربة الفورية):
              </label>
              <div className="relative">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchTerm(val);
                    const match = GRADUATES_DATABASE.find(
                      g => g.name.includes(val.trim()) || g.id.toLowerCase().includes(val.trim().toLowerCase())
                    );
                    if (match) {
                      setSelectedGraduate(match);
                    } else if (val.trim()) {
                      setSelectedGraduate(null);
                    } else {
                      setSelectedGraduate(GRADUATES_DATABASE[0]);
                    }
                  }}
                  placeholder="ابحث عن اسم الطالب (مثال: رضا فراس، مريم، فاطمة، سارة...)"
                  className="w-full pl-4 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-800 transition"
                />
              </div>

              {/* Quick Suggestions / Cohort Browser (10 Groups = 170 Graduates) */}
              <div className="mt-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    استعراض الخريجين الـ 170 حسب المجموعات الـ 10:
                  </p>
                  {onOpenStagePresentation && (
                    <button
                      type="button"
                      onClick={() => onOpenStagePresentation(selectedCohortNum - 1)}
                      className="text-[11px] font-black bg-slate-900 hover:bg-sky-700 text-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow transition cursor-pointer"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>شاشة المسرح العملاقة</span>
                    </button>
                  )}
                </div>

                {/* 10 Cohort Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2.5 no-scrollbar">
                  {GRADUATION_COHORTS.map((c) => (
                    <button
                      key={c.groupNumber}
                      type="button"
                      onClick={() => setSelectedCohortNum(c.groupNumber)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold whitespace-nowrap transition cursor-pointer ${
                        selectedCohortNum === c.groupNumber
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      مجموعة {c.groupNumber} ({c.ageStage})
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                  {GRADUATES_DATABASE.filter((g) => g.cohortNumber === selectedCohortNum).map((grad) => (
                    <button
                      key={grad.id}
                      onClick={() => {
                        setSelectedGraduate(grad);
                        setSearchTerm('');
                      }}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        activeGraduate?.id === grad.id
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{grad.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Verification Status & Details Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">حالة التوثيق الرسمي:</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  خريج معتمد بـ QR • {activeGraduate.ageGroup || '7 - 14 سنة'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80">
                  <span className="text-slate-400 block mb-0.5">المسار التقني:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{activeGraduate.track}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80">
                  <span className="text-slate-400 block mb-0.5">التقدير العام:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{activeGraduate.grade}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-750">
                <div className="flex items-center gap-2 text-sky-950 dark:text-sky-300 font-bold text-xs mb-1">
                  <Cpu className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>مشروع التخرج المنجز:</span>
                </div>
                <p className="text-xs text-sky-900 dark:text-slate-300 font-medium">{activeGraduate.project}</p>
              </div>

              {/* Official Print Actions (Inspired by Al-Farabi Print Engine) */}
              <div className="pt-2 space-y-2.5">
                <button
                  onClick={handlePrintBadge}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 transition hover:-translate-y-0.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الباج الرسمي (النسختين النهارية والليلية)</span>
                </button>

                <div className="flex gap-2.5">
                  <button
                    onClick={handlePrintCertificate}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-300 border border-amber-400/50 font-bold text-xs transition cursor-pointer"
                  >
                    <FileBadge className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>طباعة شهادة التخرج الرسمية (A4)</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    title="نسخ رابط التحقق المباشر"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? 'تم النسخ!' : 'مشاركة'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Note banner for parents */}
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>ملاحظة لأولياء الأمور:</strong> تسلّم بطاقات التخرج البلاستيكية المطبوعة بشريحة NFC الذكية وحافظة الشهادات الثلاث مباشرة على مسرح قصر الثقافة أثناء فقرة التكريم الرسمية.
              </p>
            </div>

          </div>

          {/* Interactive Card Render Column */}
          <div className="lg:col-span-7 flex justify-center">
            
            {/* The Badge Container */}
            <div 
              ref={cardRef}
              className="relative w-full max-w-[435px] bg-white rounded-[32px] p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(2,132,199,0.22)] border-[3px] border-amber-400/90 transition-all duration-300 hover:shadow-[0_30px_70px_-15px_rgba(2,132,199,0.3)]"
            >
              
              {/* Gold & Blue Tech Circuit Corner Motifs */}
              <div className="absolute top-3 left-3 w-14 h-14 border-t-2 border-l-2 border-amber-400 rounded-tl-2xl pointer-events-none" />
              <div className="absolute top-3 right-3 w-14 h-14 border-t-2 border-r-2 border-sky-500 rounded-tr-2xl pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-14 h-14 border-b-2 border-l-2 border-sky-500 rounded-bl-2xl pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-14 h-14 border-b-2 border-r-2 border-amber-400 rounded-br-2xl pointer-events-none" />

              {/* Lanyard Slot Hole (inspired by Al-Farabi Official Badge) */}
              <div className="w-16 h-3.5 mx-auto mb-2 rounded-full border border-dashed border-slate-300 bg-slate-50" />

              {/* Card Header: 1001 Digital Kids Logo Emblem */}
              <div className="text-center pt-1 pb-2.5">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="relative inline-block">
                    <span className="font-black text-4xl tracking-tight text-blue-950 font-alexandria flex items-center justify-center">
                      1<span className="text-amber-500">0</span><span className="text-sky-500">0</span>1
                    </span>
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <GraduationCap className="w-7 h-7 text-blue-950 fill-blue-950 drop-shadow-sm" />
                    </div>
                  </div>
                </div>
                <div className="text-sm font-black tracking-widest text-blue-950">
                  طفل رقمي
                </div>
                <div className="text-[9px] font-extrabold tracking-widest text-slate-500 uppercase">
                  1001 DIGITAL KIDS • AGES 7–14
                </div>
              </div>

              {/* Title Ribbon: بطاقة خريج */}
              <div className="relative my-2">
                <div className="bg-gradient-to-r from-blue-950 via-sky-800 to-blue-950 text-white py-2 px-6 rounded-2xl shadow-md text-center border-2 border-amber-400 relative overflow-hidden">
                  <div className="flex items-center justify-center gap-2 font-alexandria font-black text-base sm:text-lg">
                    <span className="text-amber-300 text-sm">★</span>
                    <span>بطاقة خريج معتمد</span>
                    <span className="text-amber-300 text-sm">★</span>
                  </div>
                  <div className="mt-0.5 inline-block bg-amber-400 text-blue-950 text-[10px] font-extrabold px-3 py-0.5 rounded-full">
                    ◆ احتفالية تخرج الدفعة الأولى • {activeGraduate.ageGroup || '7 - 14 سنة'} ◆
                  </div>
                </div>
              </div>

              {/* Center Emblem: Robot Mascot Head with Laurel Wreath */}
              <div className="my-4 flex flex-col items-center justify-center relative">
                <div className="relative w-32 h-32 rounded-full border-4 border-amber-400 bg-gradient-to-b from-sky-50 to-amber-50/50 flex items-center justify-center p-2.5 shadow-inner">
                  <div className="absolute -top-3.5 right-2 transform rotate-12 z-10">
                    <GraduationCap className="w-7 h-7 text-blue-950 drop-shadow fill-blue-950" />
                  </div>

                  <img 
                    src="/graduate/robot_mascot.jpg" 
                    alt="تميمة روبوت أبدع" 
                    className="w-22 h-22 object-contain drop-shadow"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                <span className="text-[11px] font-bold text-sky-800 mt-2 bg-sky-50 px-3 py-0.5 rounded-full border border-sky-200">
                  {activeGraduate.track}
                </span>
              </div>

              {/* Official Graduate Data Rows */}
              <div className="space-y-1.5 text-xs font-tajawal">
                
                {/* Row 1: خريج أبدع */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-extrabold text-blue-950 text-sm sm:text-base font-alexandria">
                    {activeGraduate.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold shrink-0">
                    <span>خريج أبدع :</span>
                    <div className="w-5 h-5 rounded-full bg-blue-950 text-white flex items-center justify-center">
                      <GraduationCap className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Row 2: كود العضوية */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-200/70">
                  <span className="font-mono font-bold text-slate-800 text-[11px] tracking-wider">
                    {activeGraduate.id}
                  </span>
                  <span className="text-slate-500 font-bold text-[11px]">كود العضوية :</span>
                </div>

                {/* Row 3: كود المبادرة */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-200/70">
                  <span className="font-mono font-bold text-sky-600 text-[11px]">
                    {activeGraduate.initiativeCode}
                  </span>
                  <span className="text-slate-500 font-bold text-[11px]">كود المبادرة :</span>
                </div>

                {/* Row 4: الفئة العمرية */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-200/70">
                  <span className="font-bold text-amber-600 text-[11px]">
                    خريج الدفعة الأولى ({activeGraduate.ageGroup || '7 - 14 سنة'})
                  </span>
                  <span className="text-slate-500 font-bold text-[11px]">الفئة :</span>
                </div>

                {/* Live QR Verification & Official Sponsors Row */}
                <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-sky-50/60 border border-sky-200/80 mt-2">
                  {qrUrl && (
                    <div className="bg-white p-1.5 rounded-xl border border-slate-200 shrink-0 shadow-xs text-center">
                      <img src={qrUrl} alt="رمز تحقق الخريج" className="w-16 h-16 object-contain" />
                      <span className="block text-[8px] font-mono font-bold text-slate-500 mt-0.5">QR VERIFIED</span>
                    </div>
                  )}
                  <div className="text-right space-y-1 flex-1">
                    <div className="text-[11px] font-bold text-slate-800">
                      <span className="text-slate-500">المنظم: </span>نادي أبدع للمهارات الذكية
                    </div>
                    <div className="text-[11px] font-bold text-sky-700">
                      <span className="text-slate-500">الشريك التقني: </span>شركة المصدر لتكنولوجيا المعلومات
                    </div>
                    <div className="text-[10px] font-bold text-amber-700">
                      <span className="text-slate-500">الاعتماد: </span>نقابة المبرمجين العراقيين
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Curved Wave Ribbon */}
              <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                <div className="bg-gradient-to-r from-blue-950 via-sky-900 to-blue-950 text-amber-300 py-2 px-4 rounded-2xl text-xs font-alexandria font-extrabold flex items-center justify-center gap-2 shadow-sm border border-amber-400/50">
                  <span>◆</span>
                  <span className="text-white">نصنع جيلاً يبرمج المستقبل ... معاً</span>
                  <span>◆</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
