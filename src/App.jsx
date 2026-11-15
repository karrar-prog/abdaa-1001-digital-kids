import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { Award, Gamepad2, ShieldCheck, ArrowLeft, Home, Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import PhotoMarquee from './components/PhotoMarquee';
import StorySection from './components/StorySection';
import TracksSection from './components/TracksSection';
import TrainingGallery from './components/TrainingGallery';
import AgendaTimeline from './components/AgendaTimeline';
import PartnersSection from './components/PartnersSection';
import Footer from './components/Footer';
import StickyDock from './components/StickyDock';
import { InteractiveRobotCompanion } from './components/KidCreativeDecor';
import AbdaaRobotLoader from './components/AbdaaRobotLoader';
import { parseOfficialVerification } from './utils/qrVerify';

const lazyWithRetry = (importer) =>
  lazy(async () => {
    try {
      return await importer();
    } catch (err) {
      if (typeof window !== 'undefined') {
        const reloadedKey = 'abdaa_chunk_reload';
        if (!sessionStorage.getItem(reloadedKey)) {
          sessionStorage.setItem(reloadedKey, '1');
          window.location.reload();
        }
      }
      throw err;
    }
  });

class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 text-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-2xl bg-sky-600 text-white font-bold text-xs shadow-md hover:bg-sky-500 transition cursor-pointer"
          >
            تحديث هذا القسم ↻
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const GraduateBadgeSection = lazyWithRetry(() => import('./components/GraduateBadgeSection'));
const MiniCodingPlayground = lazyWithRetry(() => import('./components/MiniCodingPlayground'));
const ProjectsExpo = lazyWithRetry(() => import('./components/ProjectsExpo'));
const MentorsHonorSection = lazyWithRetry(() => import('./components/MentorsHonorSection'));
const PhotoBoothSection = lazyWithRetry(() => import('./components/PhotoBoothSection'));
const WallOfPrideSection = lazyWithRetry(() => import('./components/WallOfPrideSection'));
const ParentSafetyFAQSection = lazyWithRetry(() => import('./components/ParentSafetyFAQSection'));
const OperationsHubSection = lazyWithRetry(() => import('./components/OperationsHubSection'));

const BookingRSVPModal = lazyWithRetry(() => import('./components/BookingRSVPModal'));
const TicketCheckerModal = lazyWithRetry(() => import('./components/TicketCheckerModal'));
const VolunteersSponsorsModal = lazyWithRetry(() => import('./components/VolunteersSponsorsModal'));
const RaffleModal = lazyWithRetry(() => import('./components/RaffleModal'));
const Batch2EnrollmentModal = lazyWithRetry(() => import('./components/Batch2EnrollmentModal'));
const JudgingPortalModal = lazyWithRetry(() => import('./components/JudgingPortalModal'));
const StagePresentationModal = lazyWithRetry(() => import('./components/StagePresentationModal'));
const AdminDashboardModal = lazyWithRetry(() => import('./components/AdminDashboardModal'));
const OfficialVerifyModal = lazyWithRetry(() => import('./components/OfficialVerifyModal'));

// خريطة الأقسام الفرعية لتوجيه الروابط تلقائياً إلى البوابة الصحيحة
const HASH_TO_VIEW_MAP = {
  hero: 'home',
  story: 'home',
  tracks: 'home',
  agenda: 'home',
  partners: 'home',
  'safety-faq': 'home',
  graduates: 'graduates',
  photobooth: 'graduates',
  'pride-wall': 'graduates',
  expo: 'expo',
  projects: 'expo',
  'coding-playground': 'expo',
  gallery: 'expo',
  mentors: 'expo',
  ops: 'ops',
  admin: 'ops'
};

function resolveViewFromLocation() {
  if (typeof window === 'undefined') return 'home';
  const search = window.location.search || '';
  if (search.includes('admin=1') || search.includes('scanner=1') || search.includes('stage=1')) {
    return 'ops';
  }
  const rawHash = (window.location.hash || '').replace(/^#/, '').split('?')[0];
  return HASH_TO_VIEW_MAP[rawHash] || 'home';
}

export default function App() {
  const [activeView, setActiveView] = useState(() => resolveViewFromLocation());
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [isVolunteerSponsorOpen, setIsVolunteerSponsorOpen] = useState(false);
  const [isRaffleOpen, setIsRaffleOpen] = useState(false);
  const [isBatch2Open, setIsBatch2Open] = useState(false);
  const [batch2InitialAge, setBatch2InitialAge] = useState(10);
  const [isJudgingOpen, setIsJudgingOpen] = useState(false);
  const [judgingInitialProject, setJudgingInitialProject] = useState(null);
  const [isStageOpen, setIsStageOpen] = useState(false);
  const [stageInitialGroup, setStageInitialGroup] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [verifiedDoc, setVerifiedDoc] = useState(null);
  const [cmsVersion, setCmsVersion] = useState(0);

  const handleSelectView = useCallback((viewId) => {
    setActiveView(viewId);
    if (typeof window !== 'undefined') {
      const targetHash = viewId === 'home' ? '#hero' : `#${viewId}`;
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search + targetHash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleNavigateSection = useCallback((viewId, sectionId) => {
    setActiveView(viewId);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search + `#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
    }
  }, []);

  useEffect(() => {
    const handleCmsUpdate = () => setCmsVersion((v) => v + 1);
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    const handleHashChange = () => {
      const rawHash = (window.location.hash || '').replace(/^#/, '').split('?')[0];
      if (rawHash === 'admin') {
        setActiveView('ops');
        setIsAdminOpen(true);
        return;
      }
      if (rawHash === 'scanner') {
        setActiveView('ops');
        setIsCheckerOpen(true);
        return;
      }
      if (rawHash === 'stage') {
        setActiveView('ops');
        setIsStageOpen(true);
        return;
      }
      const mapped = HASH_TO_VIEW_MAP[rawHash];
      if (mapped) {
        setActiveView(mapped);
        setTimeout(() => {
          const el = document.getElementById(rawHash);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    window.addEventListener('abdaa-cms-updated', handleCmsUpdate);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);

    if (window.location.search.includes('admin=1') || window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }
    if (window.location.search.includes('scanner=1') || window.location.hash === '#scanner') {
      setIsCheckerOpen(true);
    }
    if (window.location.search.includes('stage=1') || window.location.hash === '#stage') {
      setIsStageOpen(true);
    }
    if (window.location.search.includes('verify=')) {
      const parsed = parseOfficialVerification(window.location.href);
      if (parsed?.valid) {
        setVerifiedDoc(parsed);
      }
    }

    return () => {
      window.removeEventListener('abdaa-cms-updated', handleCmsUpdate);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleCloseVerifyModal = () => {
    setVerifiedDoc(null);
    if (typeof window !== 'undefined' && window.location.search.includes('verify=')) {
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  };

  const handleOpenBatch2 = (age = 10) => {
    setBatch2InitialAge(typeof age === 'number' ? age : 10);
    setIsBatch2Open(true);
  };

  const handleOpenJudging = (project = null) => {
    setJudgingInitialProject(project || null);
    setIsJudgingOpen(true);
  };

  const handleOpenStage = (groupIdx = 0) => {
    setStageInitialGroup(typeof groupIdx === 'number' ? groupIdx : 0);
    setIsStageOpen(true);
  };

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('abdaa_theme_v2');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('abdaa_theme_v2', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('abdaa_theme_v2', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col font-tajawal selection:bg-brand-500 selection:text-white transition-colors duration-300 relative">
      {/* Fixed Global Aurora Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print">
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-sky-400/25 dark:bg-sky-500/20 blur-[110px] animate-float-slow" />
        <div className="absolute top-1/3 -left-32 w-[450px] h-[450px] rounded-full bg-amber-400/20 dark:bg-amber-500/15 blur-[115px] animate-float-delayed" />
        <div className="absolute bottom-12 right-1/4 w-[420px] h-[420px] rounded-full bg-indigo-400/20 dark:bg-indigo-500/15 blur-[120px] animate-float-slow" />
      </div>

      {/* Clean Segmented Navigation */}
      <Navbar
        activeView={activeView}
        onSelectView={handleSelectView}
        onNavigateSection={handleNavigateSection}
        onOpenRSVP={() => setIsRSVPOpen(true)}
        onOpenRaffle={() => setIsRaffleOpen(true)}
        onOpenBatch2={handleOpenBatch2}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Sub-View Breadcrumb Bar when browsing non-home portals */}
      {activeView !== 'home' && (
        <div className="relative z-20 bg-sky-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-sky-200/60 dark:border-slate-800 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {activeView === 'graduates' && 'أنت تتصفح الآن: بوابة الخريجين والشهادات الرسمية وجدار التهاني (170 خريجاً)'}
                {activeView === 'expo' && 'أنت تتصفح الآن: معرض الابتكارات الـ 40 ومختبر البرمجة ولوحة شرف المدربين'}
                {activeView === 'ops' && 'أنت تتصفح الآن: بوابة العمليات الميدانية واللجان التنظيمية'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleSelectView('home')}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sky-700 dark:text-sky-300 font-black hover:border-sky-400 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>العودة للرئيسية</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Organized into 4 Focused Portals */}
      <main key={`${cmsVersion}-${activeView}`} className="flex-1 relative z-10">
        {activeView === 'home' && (
          <>
            <Hero onOpenRSVP={() => setIsRSVPOpen(true)} onOpenBatch2={handleOpenBatch2} />
            <StatsBar />

            {/* Dedicated Interactive Portal Cards to Prevent Endless Scroll Fatigue */}
            <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={() => handleSelectView('graduates')}
                  className="text-right group rounded-3xl p-6 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-sky-200/80 dark:border-sky-900/70 shadow-[0_12px_35px_-12px_rgba(2,132,199,0.16)] hover:-translate-y-1 hover:border-sky-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                      170 خريجاً • 10 مجموعات
                    </span>
                  </div>
                  <h3 className="font-alexandria font-black text-base sm:text-lg text-slate-900 dark:text-white mb-1">
                    بوابة الخريجين والشهادات بـ QR
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    ابحث عن اسم طفلك، استعرض واطبع شهادة التخرج وباج العضوية، والتقط بطاقة التهنئة العائلية.
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-sky-600 dark:text-sky-400 group-hover:gap-2.5 transition-all">
                    <span>دخول بوابة الخريجين</span>
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectView('expo')}
                  className="text-right group rounded-3xl p-6 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-amber-200/80 dark:border-amber-900/70 shadow-[0_12px_35px_-12px_rgba(245,158,11,0.16)] hover:-translate-y-1 hover:border-amber-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
                      <Gamepad2 className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      40 مشروعاً + مختبر تفاعلي
                    </span>
                  </div>
                  <h3 className="font-alexandria font-black text-base sm:text-lg text-slate-900 dark:text-white mb-1">
                    معرض الابتكارات ومختبر البرمجة
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    استكشف المشاريع الـ 40 للأبطال، جرّب تحدي روبوت أبدع البرمجي، وتعرّف على المدربين الـ 20.
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 group-hover:gap-2.5 transition-all">
                    <span>استكشاف المعرض والمختبر</span>
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectView('ops')}
                  className="text-right group rounded-3xl p-6 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-indigo-200/80 dark:border-indigo-900/70 shadow-[0_12px_35px_-12px_rgba(79,70,229,0.16)] hover:-translate-y-1 hover:border-indigo-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-900 text-amber-300 flex items-center justify-center shadow-md">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                      لجان الحفل والإدارة
                    </span>
                  </div>
                  <h3 className="font-alexandria font-black text-base sm:text-lg text-slate-900 dark:text-white mb-1">
                    بوابة المنظمين والعمليات الميدانية
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    ماسح كاميرا التذاكر والهويات، شاشة المسرح العملاقة، التحكيم العلمي، القرعة، ولوحة الإدارة.
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400 group-hover:gap-2.5 transition-all">
                    <span>فتح مركز العمليات</span>
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </section>

            <PhotoMarquee />
            <StorySection onOpenRSVP={() => setIsRSVPOpen(true)} />
            <TracksSection onOpenRSVP={() => setIsRSVPOpen(true)} onOpenBatch2={handleOpenBatch2} />
            <AgendaTimeline />
            <PartnersSection onOpenVolunteerSponsor={() => setIsVolunteerSponsorOpen(true)} />
            <SectionErrorBoundary>
              <Suspense fallback={<AbdaaRobotLoader compact label="جارٍ تحميل ميثاق الأمان والأسئلة الشائعة..." />}>
                <ParentSafetyFAQSection
                  onOpenRSVP={() => setIsRSVPOpen(true)}
                  onOpenVolunteerSponsor={() => setIsVolunteerSponsorOpen(true)}
                  onOpenRaffle={() => setIsRaffleOpen(true)}
                  onOpenBatch2={handleOpenBatch2}
                  onOpenJudgingPortal={handleOpenJudging}
                />
              </Suspense>
            </SectionErrorBoundary>
          </>
        )}

        {activeView === 'graduates' && (
          <SectionErrorBoundary>
            <Suspense fallback={<AbdaaRobotLoader compact label="جارٍ تحميل بوابة الخريجين والشهادات..." />}>
              <GraduateBadgeSection onOpenStagePresentation={handleOpenStage} />
              <PhotoBoothSection />
              <WallOfPrideSection />
            </Suspense>
          </SectionErrorBoundary>
        )}

        {activeView === 'expo' && (
          <SectionErrorBoundary>
            <Suspense fallback={<AbdaaRobotLoader compact label="جارٍ تحميل معرض الـ 40 ابتكاراً ومختبر البرمجة..." />}>
              <ProjectsExpo onOpenJudgingPortal={handleOpenJudging} />
              <MiniCodingPlayground onOpenBatch2={handleOpenBatch2} />
              <TrainingGallery />
              <MentorsHonorSection />
            </Suspense>
          </SectionErrorBoundary>
        )}

        {activeView === 'ops' && (
          <SectionErrorBoundary>
            <Suspense fallback={<AbdaaRobotLoader compact label="جارٍ تجهيز بوابة العمليات واللجان..." />}>
              <OperationsHubSection
                onOpenChecker={() => setIsCheckerOpen(true)}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onOpenStagePresentation={handleOpenStage}
                onOpenJudgingPortal={handleOpenJudging}
                onOpenRaffle={() => setIsRaffleOpen(true)}
                onOpenVolunteerSponsor={() => setIsVolunteerSponsorOpen(true)}
                onNavigateView={handleSelectView}
              />
            </Suspense>
          </SectionErrorBoundary>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenRSVP={() => setIsRSVPOpen(true)}
        onOpenChecker={() => setIsCheckerOpen(true)}
        onOpenVolunteerSponsor={() => setIsVolunteerSponsorOpen(true)}
        onOpenRaffle={() => setIsRaffleOpen(true)}
        onOpenBatch2={handleOpenBatch2}
        onOpenJudgingPortal={handleOpenJudging}
        onOpenStagePresentation={handleOpenStage}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Quick Action Dock */}
      <StickyDock
        onOpenRSVP={() => setIsRSVPOpen(true)}
        onOpenChecker={() => setIsCheckerOpen(true)}
        onOpenBatch2={handleOpenBatch2}
      />

      {/* Interactive Playful Robot Companion for Kids & Parents */}
      <InteractiveRobotCompanion onOpenBatch2={handleOpenBatch2} />

      <Suspense fallback={null}>
        <BookingRSVPModal isOpen={isRSVPOpen} onClose={() => setIsRSVPOpen(false)} />
        <TicketCheckerModal isOpen={isCheckerOpen} onClose={() => setIsCheckerOpen(false)} />
        <VolunteersSponsorsModal
          isOpen={isVolunteerSponsorOpen}
          onClose={() => setIsVolunteerSponsorOpen(false)}
        />
        <RaffleModal isOpen={isRaffleOpen} onClose={() => setIsRaffleOpen(false)} />
        <Batch2EnrollmentModal
          isOpen={isBatch2Open}
          onClose={() => setIsBatch2Open(false)}
          initialAge={batch2InitialAge}
        />
        <JudgingPortalModal
          isOpen={isJudgingOpen}
          onClose={() => setIsJudgingOpen(false)}
          initialProject={judgingInitialProject}
        />
        <StagePresentationModal
          isOpen={isStageOpen}
          onClose={() => setIsStageOpen(false)}
          initialGroupIndex={stageInitialGroup}
        />
        <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        <OfficialVerifyModal verifiedDoc={verifiedDoc} onClose={handleCloseVerifyModal} />
      </Suspense>
    </div>
  );
}
