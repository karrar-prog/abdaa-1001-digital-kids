import React, { useState } from 'react';
import { 
  Ticket, 
  Menu, 
  X, 
  Sparkles, 
  Award, 
  Camera, 
  Cpu, 
  Calendar, 
  Building2, 
  Home, 
  Moon, 
  Sun,
  Gift,
  ShieldCheck,
  GraduationCap,
  Tv,
  Volume2,
  VolumeX,
  Gamepad2
} from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playClickPop } from '../utils/soundEffects';

export default function Navbar({
  onOpenRSVP,
  onOpenRaffle,
  onOpenBatch2,
  onOpenStagePresentation,
  darkMode,
  onToggleDarkMode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClickPop();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#hero" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 p-0.5 shadow-md shadow-sky-500/15 group-hover:scale-105 transition-transform shrink-0">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
                  <img src="/logo.svg" alt="نادي أبدع" className="w-7 h-7 object-contain" />
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="font-alexandria font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">نادي أبدع</span>
                  <span className="text-[10px] bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800 whitespace-nowrap">
                    الدفعة الأولى
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-tajawal">مبادرة «1001» طفل رقمي</p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation - Clean, Balanced & Spacious */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-2 text-[13.5px] font-medium text-slate-600 dark:text-slate-300">
            <a 
              href="#hero" 
              className="px-3 py-1.5 rounded-full hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-sky-600 dark:hover:text-sky-400 transition-all whitespace-nowrap"
            >
              الرئيسية
            </a>
            
            <a 
              href="#story" 
              className="px-3 py-1.5 rounded-full hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-sky-600 dark:hover:text-sky-400 transition-all whitespace-nowrap"
            >
              قصة الإلهام
            </a>

            <a 
              href="#tracks" 
              className="px-3 py-1.5 rounded-full hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-sky-600 dark:hover:text-sky-400 transition-all whitespace-nowrap"
            >
              المراحل (7–14 سنة)
            </a>

            <a 
              href="#coding-playground" 
              className="px-3 py-1.5 rounded-full bg-amber-50/80 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 font-bold transition-all inline-flex items-center gap-1.5 whitespace-nowrap border border-amber-200/80 dark:border-amber-800"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>مختبر البرمجة</span>
            </a>

            <a 
              href="#projects" 
              className="px-3 py-1.5 rounded-full hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-sky-600 dark:hover:text-sky-400 transition-all inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>معرض الابتكارات</span>
              <span className="text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-800">40 مشروعاً</span>
            </a>

            <a 
              href="#graduates" 
              className="px-3 py-1.5 rounded-full bg-sky-50/70 dark:bg-sky-950/70 hover:bg-sky-100/80 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 font-bold transition-all inline-flex items-center gap-1.5 whitespace-nowrap border border-sky-100 dark:border-sky-850"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>بطاقات الخريجين</span>
            </a>

            <a 
              href="#mentors" 
              className="px-3 py-1.5 rounded-full hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-sky-600 dark:hover:text-sky-400 transition-all whitespace-nowrap"
            >
              المدربون
            </a>

            <a 
              href="#pride-wall" 
              className="px-3 py-1.5 rounded-full hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-sky-600 dark:hover:text-sky-400 transition-all whitespace-nowrap"
            >
              جدار الفخر
            </a>

            <a 
              href="#agenda" 
              className="px-3 py-1.5 rounded-full hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-sky-600 dark:hover:text-sky-400 transition-all whitespace-nowrap"
            >
              برنامج الحفل
            </a>

            <a 
              href="#partners" 
              className="px-3 py-1.5 rounded-full hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-sky-600 dark:hover:text-sky-400 transition-all whitespace-nowrap"
            >
              الرعاة والشركاء
            </a>
          </nav>

          {/* Action Area: Sound Toggle + Dark Mode Toggle + Raffle + Single Prominent Button */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Kid Sound Effects Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2.5 rounded-full border transition-all duration-300 shadow-xs flex items-center justify-center cursor-pointer ${
                soundOn
                  ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
              title={soundOn ? 'كتم المؤثرات الصوتية التفاعلية' : 'تشغيل المؤثرات الصوتية التفاعلية'}
              aria-label="تبديل الصوت"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Cinematic Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-300 shadow-xs flex items-center justify-center group cursor-pointer"
              title={darkMode ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع السينمائي الليلي"}
              aria-label="تبديل المظهر"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>

            {onOpenBatch2 && (
              <button
                onClick={() => onOpenBatch2(10)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-extrabold text-sky-900 dark:text-sky-200 bg-sky-100/80 dark:bg-sky-950/70 hover:bg-sky-200/80 dark:hover:bg-sky-900/80 border border-sky-300 dark:border-sky-800 transition-all cursor-pointer whitespace-nowrap"
                title="التسجيل المبكر لأطفال الدفعة الثانية (7–14 سنة)"
              >
                <GraduationCap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>الدفعة 2</span>
              </button>
            )}

            {onOpenRaffle && (
              <button
                onClick={onOpenRaffle}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-extrabold text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/70 hover:bg-amber-200/80 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-800 transition-all cursor-pointer whitespace-nowrap"
                title="منصة القرعة وجوائز الحفل"
              >
                <Gift className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>القرعة</span>
              </button>
            )}

            <button
              onClick={onOpenRSVP}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>احجز مقعدك الآن</span>
            </button>
          </div>

          {/* Mobile & Tablet Toggle */}
          <div className="xl:hidden flex items-center gap-2">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700"
              aria-label="تبديل المظهر"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={onOpenRSVP}
              className="md:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 shadow-sm whitespace-nowrap"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>حجز تذكرة</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-1.5 animate-fadeIn shadow-2xl">
          <a 
            href="#hero" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>الرئيسية وموعد الحفل</span>
          </a>
          <a 
            href="#story" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>قصة الإلهام وأبطال العرب</span>
          </a>
          <a 
            href="#tracks" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <Cpu className="w-4 h-4 text-sky-500" />
            <span>المحاور التعليمية الأربعة</span>
          </a>
          <a 
            href="#projects" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <span>معرض الابتكارات الطلابية</span>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">40 مشروعاً</span>
          </a>
          <a 
            href="#graduates" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-sky-700 dark:text-sky-300 bg-sky-50/70 dark:bg-sky-950/70 border border-sky-100 dark:border-sky-850"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>بطاقات الخريجين الرقمية</span>
            </span>
            <span className="text-[10px] bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 font-bold px-2 py-0.5 rounded-full">الدفعة الأولى</span>
          </a>
          <a 
            href="#gallery" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <Camera className="w-4 h-4 text-slate-400" />
            <span>كواليس التدريب وصناعة الأبطال</span>
          </a>
          <a 
            href="#agenda" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>برنامج فقرات الحفل</span>
          </a>
          <a 
            href="#partners" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>الرعاة وشركاء النجاح</span>
          </a>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRSVP(); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-md"
            >
              <Ticket className="w-4 h-4" />
              <span>احجز تذكرتك واستلم رمز QR</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}