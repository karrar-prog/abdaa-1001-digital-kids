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

export default function App() {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [isVolunteerSponsorOpen, setIsVolunteerSponsorOpen] = useState(false);
  const [isRaffleOpen, setIsRaffleOpen] = useState(false);
  
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
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero 
          onOpenRSVP={() => setIsRSVPOpen(true)}
        />
        <StatsBar />
        
        {/* Continuous Animated Photo Marquee / Live Reel */}
        <PhotoMarquee />

        <StorySection 
          onOpenRSVP={() => setIsRSVPOpen(true)}
        />
        <GraduateBadgeSection />
        <TracksSection 
          onOpenRSVP={() => setIsRSVPOpen(true)}
        />
        <TrainingGallery />
        <ProjectsExpo />
        <ParentSafetyFAQSection 
          onOpenRSVP={() => setIsRSVPOpen(true)}
          onOpenVolunteerSponsor={() => setIsVolunteerSponsorOpen(true)}
          onOpenRaffle={() => setIsRaffleOpen(true)}
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
      />

      {/* Floating Quick Action Dock */}
      <StickyDock 
        onOpenRSVP={() => setIsRSVPOpen(true)}
        onOpenChecker={() => setIsCheckerOpen(true)}
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

    </div>
  );
}
