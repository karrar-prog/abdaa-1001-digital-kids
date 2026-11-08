import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import PhotoMarquee from './components/PhotoMarquee';
import StorySection from './components/StorySection';
import GraduateBadgeSection from './components/GraduateBadgeSection';
import TracksSection from './components/TracksSection';
import TrainingGallery from './components/TrainingGallery';
import ProjectsExpo from './components/ProjectsExpo';
import ParentSafetyFAQSection from './components/ParentSafetyFAQSection';
import AgendaTimeline from './components/AgendaTimeline';
import PartnersSection from './components/PartnersSection';
import Footer from './components/Footer';
import StickyDock from './components/StickyDock';

import BookingRSVPModal from './components/BookingRSVPModal';
import TicketCheckerModal from './components/TicketCheckerModal';
import VolunteersSponsorsModal from './components/VolunteersSponsorsModal';
import RaffleModal from './components/RaffleModal';
import Batch2EnrollmentModal from './components/Batch2EnrollmentModal';
import JudgingPortalModal from './components/JudgingPortalModal';
import StagePresentationModal from './components/StagePresentationModal';
import AdminDashboardModal from './components/AdminDashboardModal';

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
  
  // High-Tech Dark Mode State with LocalStorage Persistence
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('abdaa_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('abdaa_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('abdaa_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-tajawal selection:bg-brand-500 selection:text-white transition-colors duration-300">
      
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
        <GraduateBadgeSection 
          onOpenStagePresentation={handleOpenStage}
        />
        <TracksSection 
          onOpenRSVP={() => setIsRSVPOpen(true)}
          onOpenBatch2={handleOpenBatch2}
        />
        <TrainingGallery />
        <ProjectsExpo 
          onOpenJudgingPortal={handleOpenJudging}
        />
        <ParentSafetyFAQSection 
          onOpenRSVP={() => setIsRSVPOpen(true)}
          onOpenVolunteerSponsor={() => setIsVolunteerSponsorOpen(true)}
          onOpenRaffle={() => setIsRaffleOpen(true)}
          onOpenBatch2={handleOpenBatch2}
          onOpenJudgingPortal={handleOpenJudging}
        />
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

    </div>
  );
}
