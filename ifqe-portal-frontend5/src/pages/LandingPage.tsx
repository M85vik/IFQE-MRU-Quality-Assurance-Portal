// src/pages/LandingPage.tsx

import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import PillarsSection from '../components/landing/PillarsSection';
import LeadershipSection from '../components/landing/LeadershipSection';
import SchoolsAndDepartmentsSection from '../components/landing/SchoolsAndDepartmentsSection';
import FrameworkSection from '../components/landing/FrameworkSection';
import QualityInActionSection from '../components/landing/QualityInActionSection';
import AnnouncementsSection from '../components/landing/AnnouncementsSection';
import InteractiveHubSection from '../components/landing/InteractiveHubSection';
import CallToActionSection from '../components/landing/CallToActionSection';
import FooterSection from '../components/landing/FooterSection';
import Footer from '../components/landing/Footer';
const LandingPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PillarsSection />
        <LeadershipSection />
        <SchoolsAndDepartmentsSection />
        <FrameworkSection />
        <QualityInActionSection />
        <AnnouncementsSection />
        <InteractiveHubSection />
        <CallToActionSection />
        <FooterSection />
        <Footer />
      </main>
    </>
  );
};

export default LandingPage;