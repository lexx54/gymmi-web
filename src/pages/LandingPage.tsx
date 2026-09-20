import React from 'react';
import styled from 'styled-components';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesShowcase } from '../components/landing/FeaturesShowcase';
import { AudienceDeepDive } from '../components/landing/AudienceDeepDive';
import { PricingSection } from '../components/landing/PricingSection';
import { FAQSection } from '../components/landing/FAQSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <PageWrapper>
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesShowcase />
        <AudienceDeepDive />
        <PricingSection />
        <FAQSection />
      </main>
      <LandingFooter />
    </PageWrapper>
  );
};

export default LandingPage;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #0b1120;
  color: #f8fafc;
  font-family: inherit;
  overflow-x: hidden;
`;
