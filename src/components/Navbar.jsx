import React, { useState } from 'react';
import {
  Ticket,
  Menu,
  X,
  Award,
  Cpu,
  Calendar,
  Building2,
  Home,
  Moon,
  Sun,
  Gift,
  ShieldCheck,
  GraduationCap,
  Volume2,
  VolumeX,
  Gamepad2
} from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playClickPop } from '../utils/soundEffects';

export const PLATFORM_VIEWS = [
  { id: 'home', label: 'الرئيسية والاحتفالية', shortLabel: 'الرئيسية', icon: Home },
  { id: 'graduates', label: 'الخريجون والشهادات', shortLabel: 'الخريجون', badge: '170', icon: Award },
  { id: 'expo', label: 'المعرض والمختبر', shortLabel: 'المعرض', badge: '40', icon: Gamepad2 },
  { id: 'ops', label: 'بوابة المنظمين', shortLabel: 'المنظمون', icon: ShieldCheck }
];

export default function Navbar({
  activeView = 'home',
  onSelectView,
  onNavigateSection,
  onOpenRSVP,
  onOpenRaffle,
  onOpenBatch2,
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

  const handleSelectPortal = (viewId) => {
    if (onSelectView) onSelectView(viewId);
    setMobileMenuOpen(false);
  };

  const handleQuickSection = (viewId, sectionId) => {
    if (onNavigateSection) {
      onNavigateSection(viewId, sectionId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/75 dark:bg-slate-950/75 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 shadow-[0_8px_32px_-8px_rgba(14,165,233,0.12)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleSelectPortal('home')}
              className="flex items-center gap-3 group text-right cursor-pointer"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-amber-500 p-0.5 shadow-md shadow-sky-500/15 group-hover:scale-105 transition-transform shrink-0">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden p-1">
                  <img
                    src="/brand/abdaa-logo.png"
                    alt="نادي أبدع للمهارات الذكية"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-alexandria font-bold text-sm sm:text-lg text-slate-900 dark:text-white tracking-tight">
                    نادي أبدع
                  </span>
                  <span className="text-[10px] bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800 whitespace-nowrap">
                    الدفعة الأولى
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-tajawal">
                  مبادرة «1001» طفل رقمي
                </p>
              </div>
            </button>
          </div>

          {/* Desktop & Laptop Segmented Portal Navigation (Clean 4 Portals instead of 10 crowded links) */}
          <nav className="hidden lg:flex items-center p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 gap-1">
            {PLATFORM_VIEWS.map((view) => {
              const Icon = view.icon;
              const isActive = activeView === view.id;
              return (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => handleSelectPortal(view.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs xl:text-[13px] font-black transition-all inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-sky-600 text-sky-700 dark:text-white shadow-sm border border-sky-200/80 dark:border-sky-500'
                      : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white/60 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500 dark:text-amber-300' : ''}`} />
                  <span>{view.label}</span>
                  {view.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-200/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {view.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Area */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
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

            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-300 shadow-xs flex items-center justify-center group cursor-pointer"
              title={darkMode ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع السينمائي الليلي'}
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
                className="hidden xl:flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-extrabold text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/70 hover:bg-amber-200/80 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-800 transition-all cursor-pointer whitespace-nowrap"
                title="منصة القرعة وجوائز الحفل"
              >
                <Gift className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>القرعة</span>
              </button>
            )}

            <button
              onClick={onOpenRSVP}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>احجز مقعدك الآن</span>
            </button>
          </div>

          {/* Mobile & Tablet Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700"
              aria-label="تبديل المظهر"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={onOpenRSVP}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 shadow-sm whitespace-nowrap"
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

        {/* Mobile Quick 4-Tab Bar (Visible on mobile/tablet without needing to open hamburger menu) */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto pb-2.5 no-scrollbar">
          {PLATFORM_VIEWS.map((view) => {
            const Icon = view.icon;
            const isActive = activeView === view.id;
            return (
              <button
                key={view.id}
                type="button"
                onClick={() => handleSelectPortal(view.id)}
                className={`flex-1 min-w-fit px-3 py-1.5 rounded-xl text-[11px] font-black transition flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{view.shortLabel}</span>
                {view.badge && (
                  <span
                    className={`text-[9px] px-1.5 rounded-full font-extrabold ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    {view.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile & Tablet Drawer with Direct Section Shortcuts */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-1.5 animate-fadeIn shadow-2xl">
          <div className="text-[11px] font-black text-slate-400 px-2 pb-1">الانتقال السريع لأقسام المنصة:</div>

          <button
            type="button"
            onClick={() => handleQuickSection('home', 'hero')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <Home className="w-4 h-4 text-sky-500" />
            <span>الرئيسية وموعد الحفل</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSection('graduates', 'graduates')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-sky-700 dark:text-sky-300 bg-sky-50/70 dark:bg-sky-950/70"
          >
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>بطاقات وشهادات الخريجين + التهاني</span>
            </span>
            <span className="text-[10px] bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 font-bold px-2 py-0.5 rounded-full">
              170 خريجاً
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSection('expo', 'projects')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>معرض الابتكارات ومختبر البرمجة والمدربون</span>
            </span>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
              40 مشروعاً
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSection('home', 'agenda')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>المنهاج الزمني لفقرات الحفل</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSection('home', 'partners')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>الشركاء والرعاة الداعمون</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectPortal('ops')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-900"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>بوابة المنظمين واللجان وإصدار الهويات</span>
          </button>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRSVP();
              }}
              className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs shadow-md"
            >
              <Ticket className="w-4 h-4" />
              <span>حجز مقعد الحفل</span>
            </button>
            {onOpenBatch2 && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBatch2(10);
                }}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-sm"
              >
                <GraduationCap className="w-4 h-4" />
                <span>تسجيل الدفعة 2</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
