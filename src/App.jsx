import React, { useState, useEffect, Suspense, lazy } from 'react';
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

const BookingRSVPModal = lazyWithRetry(() => import('./components/BookingRSVPModal'));
const TicketCheckerModal = lazyWithRetry(() => import('./components/TicketCheckerModal'));
const VolunteersSponsorsModal = lazyWithRetry(() => import('./components/VolunteersSponsorsModal'));
const RaffleModal = lazyWithRetry(() => import('./components/RaffleModal'));
const Batch2EnrollmentModal = lazyWithRetry(() => import('./components/Batch2EnrollmentModal'));
const JudgingPortalModal = lazyWithRetry(() => import('./components/JudgingPortalModal'));
const StagePresentationModal = lazyWithRetry(() => import('./components/StagePresentationModal'));
const AdminDashboardModal = lazyWithRetry(() => import('./components/AdminDashboardModal'));

export default function App() {
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
  
  // Default to Light (Day) Theme unless explicitly switched by user
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

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col font-tajawal selection:bg-brand-500 selection:text-white transition-colors duration-300 relative">
      
      {/* Fixed Global Aurora Orbs for True Crystal Glassmorphism Refraction */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print">
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-sky-400/25 dark:bg-sky-500/20 blur-[110px] animate-float-slow" />
        <div className="absolute top-1/3 -left-32 w-[450px] h-[450px] rounded-full bg-amber-400/20 dark:bg-amber-500/15 blur-[115px] animate-float-delayed" />
        <div className="absolute bottom-12 right-1/4 w-[420px] h-[420px] rounded-full bg-indigo-400/20 dark:bg-indigo-500/15 blur-[120px] animate-float-slow" />
      </div>

      {/* Navigation */}
      <Navbar 
        onOpenRSVP={() => setIsRSVPOpen(true)}
        onOpenRaffle={() => setIsRaffleOpen(true)}
        onOpenBatch2={handleOpenBatch2}
        onOpenStagePresentation={handleOpenStage}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero 
          onOpenRSVP={() => setIsRSVPOpen(true)}
          onOpenBatch2={handleOpenBatch2}
        />
        <StatsBar />
        
        {/* Continuous Animated Photo Marquee / Live Reel */}
        <PhotoMarquee />

        <StorySection 
          onOpenRSVP={() => setIsRSVPOpen(true)}
        />
        <SectionErrorBoundary>
          <Suspense fallback={<AbdaaRobotLoader compact label="جارٍ تحميل بطاقات الخريجين..." />}>
            <GraduateBadgeSection 
              onOpenStagePresentation={handleOpenStage}
            />
          </Suspense>
        </SectionErrorBoundary>
        <TracksSection 
          onOpenRSVP={() => setIsRSVPOpen(true)}
          onOpenBatch2={handleOpenBatch2}
        />
        <SectionErrorBoundary>
          <Suspense fallback={<AbdaaRobotLoader compact label="جارٍ تشغيل استوديو روبوت أبدع..." />}>
            <MiniCodingPlayground 
              onOpenBatch2={handleOpenBatch2}
            />
          </Suspense>
        </SectionErrorBoundary>
        <TrainingGallery />
        <SectionErrorBoundary>
          <Suspense fallback={<AbdaaRobotLoader compact label="جارٍ تحميل معرض الـ 40 ابتكاراً..." />}>
            <ProjectsExpo 
              onOpenJudgingPortal={handleOpenJudging}
            />
            <MentorsHonorSection />
            <PhotoBoothSection />
            <WallOfPrideSection />
            <ParentSafetyFAQSection 
              onOpenRSVP={() => setIsRSVPOpen(true)}
              onOpenVolunteerSponsor={() => setIsVolunteerSponsorOpen(true)}
              onOpenRaffle={() => setIsRaffleOpen(true)}
              onOpenBatch2={handleOpenBatch2}
              onOpenJudgingPortal={handleOpenJudging}
            />
          </Suspense>
        </SectionErrorBoundary>
        <AgendaTimeline />
        <PartnersSection 
          onOpenVolunteerSponsor={() => setIsVolunteerSponsorOpen(true)}
        />
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
        {/* Interactive Booking & Hall Seat Map Modal */}
        <BookingRSVPModal 
          isOpen={isRSVPOpen} 
          onClose={() => setIsRSVPOpen(false)} 
        />

        {/* Organizer Ticket & QR Verification Modal */}
        <TicketCheckerModal 
          isOpen={isCheckerOpen}
          onClose={() => setIsCheckerOpen(false)}
        />

        {/* Volunteers & Sponsors Portal Modal */}
        <VolunteersSponsorsModal 
          isOpen={isVolunteerSponsorOpen}
          onClose={() => setIsVolunteerSponsorOpen(false)}
        />

        {/* Live Stage Raffle & Prizes Modal */}
        <RaffleModal 
          isOpen={isRaffleOpen}
          onClose={() => setIsRaffleOpen(false)}
        />

        {/* Batch 2 Early Registration Modal (Ages 7-14) */}
        <Batch2EnrollmentModal
          isOpen={isBatch2Open}
          onClose={() => setIsBatch2Open(false)}
          initialAge={batch2InitialAge}
        />

        {/* Scientific Judging & Live Leaderboard Modal (40 Projects) */}
        <JudgingPortalModal
          isOpen={isJudgingOpen}
          onClose={() => setIsJudgingOpen(false)}
          initialProject={judgingInitialProject}
        />

        {/* Giant Stage LED Presentation Mode (10 Cohorts / 170 Graduates) */}
        <StagePresentationModal
          isOpen={isStageOpen}
          onClose={() => setIsStageOpen(false)}
          initialGroupIndex={stageInitialGroup}
        />

        {/* Organizer & Admin Operations Dashboard */}
        <AdminDashboardModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      </Suspense>

    </div>
  );
}
