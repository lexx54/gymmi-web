import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Dumbbell, Globe, Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LandingNavbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <NavContainer>
      <NavInner>
        <LogoLink to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <LogoIconWrapper>
            <Dumbbell size={22} color="#ffffff" />
          </LogoIconWrapper>
          <LogoText>
            GYMMI<span>.</span>
          </LogoText>
        </LogoLink>

        {/* Desktop Navigation Links */}
        <NavLinks>
          <NavLinkButton type="button" onClick={() => handleNavClick('features')}>
            {t('landing.nav.features')}
          </NavLinkButton>
          <NavLinkButton type="button" onClick={() => handleNavClick('ecosystem')}>
            {t('landing.nav.ecosystem')}
          </NavLinkButton>
          <NavLinkButton type="button" onClick={() => handleNavClick('pricing')}>
            {t('landing.nav.pricing')}
          </NavLinkButton>
          <NavLinkButton type="button" onClick={() => handleNavClick('faq')}>
            {t('landing.nav.faq')}
          </NavLinkButton>
        </NavLinks>

        {/* Action Controls */}
        <NavActions>
          <LangToggleButton
            type="button"
            onClick={toggleLanguage}
            title="Switch Language / Cambiar Idioma"
            aria-label="Switch Language"
          >
            <Globe size={16} />
            <span>{i18n.language.toUpperCase().slice(0, 2)}</span>
          </LangToggleButton>

          {isAuthenticated ? (
            <PrimaryButton type="button" onClick={() => navigate('/dashboard')}>
              <LayoutDashboard size={16} />
              <span>{t('landing.nav.dashboard')}</span>
            </PrimaryButton>
          ) : (
            <>
              <GhostLink to="/login">{t('landing.nav.login')}</GhostLink>
              <PrimaryLink to="/signup">
                <span>{t('landing.nav.signup')}</span>
                <ArrowRight size={15} />
              </PrimaryLink>
            </>
          )}

          <MobileMenuButton
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </NavActions>
      </NavInner>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <MobileMenu>
          <MobileNavButton type="button" onClick={() => handleNavClick('features')}>
            {t('landing.nav.features')}
          </MobileNavButton>
          <MobileNavButton type="button" onClick={() => handleNavClick('ecosystem')}>
            {t('landing.nav.ecosystem')}
          </MobileNavButton>
          <MobileNavButton type="button" onClick={() => handleNavClick('pricing')}>
            {t('landing.nav.pricing')}
          </MobileNavButton>
          <MobileNavButton type="button" onClick={() => handleNavClick('faq')}>
            {t('landing.nav.faq')}
          </MobileNavButton>

          <MobileAuthSection>
            {isAuthenticated ? (
              <MobilePrimaryButton type="button" onClick={() => navigate('/dashboard')}>
                <LayoutDashboard size={18} />
                <span>{t('landing.nav.dashboard')}</span>
              </MobilePrimaryButton>
            ) : (
              <>
                <MobileGhostLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                  {t('landing.nav.login')}
                </MobileGhostLink>
                <MobilePrimaryLink to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <span>{t('landing.nav.signup')}</span>
                  <ArrowRight size={16} />
                </MobilePrimaryLink>
              </>
            )}
          </MobileAuthSection>
        </MobileMenu>
      )}
    </NavContainer>
  );
};

const NavContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: rgba(15, 23, 42, 0.82);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: background-color 0.3s ease;
`;

const NavInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  cursor: pointer;
`;

const LogoIconWrapper = styled.div`
  width: 2.375rem;
  height: 2.375rem;
  border-radius: 0.625rem;
  background: linear-gradient(135deg, #ef233c 0%, #d90429 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(239, 35, 60, 0.35);
`;

const LogoText = styled.span`
  font-size: 1.35rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #ffffff;

  span {
    color: #ef233c;
  }
`;

const NavLinks = styled.nav`
  display: none;
  align-items: center;
  gap: 2rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLinkButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LangToggleButton = styled.button`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  padding: 0.45rem 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
    color: #ffffff;
  }
`;

const GhostLink = styled(Link)`
  display: none;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 600;
  padding: 0.5rem 0.875rem;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }

  @media (min-width: 640px) {
    display: inline-block;
  }
`;

const PrimaryLink = styled(Link)`
  display: none;
  align-items: center;
  gap: 0.5rem;
  background: #ef233c;
  color: #ffffff;
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 700;
  padding: 0.55rem 1.15rem;
  border-radius: 0.625rem;
  box-shadow: 0 4px 14px rgba(239, 35, 60, 0.35);
  transition: all 0.2s ease;

  &:hover {
    background: #d90429;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(239, 35, 60, 0.45);
  }

  @media (min-width: 640px) {
    display: flex;
  }
`;

const PrimaryButton = styled.button`
  display: none;
  align-items: center;
  gap: 0.5rem;
  background: #ef233c;
  border: none;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 700;
  padding: 0.55rem 1.15rem;
  border-radius: 0.625rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(239, 35, 60, 0.35);
  transition: all 0.2s ease;

  &:hover {
    background: #d90429;
    transform: translateY(-1px);
  }

  @media (min-width: 640px) {
    display: flex;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  background: #0b1120;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.25rem 1.5rem 1.5rem;
  gap: 1rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavButton = styled.button`
  background: none;
  border: none;
  text-align: left;
  color: #cbd5e1;
  font-size: 1.05rem;
  font-weight: 600;
  padding: 0.5rem 0;
  cursor: pointer;

  &:hover {
    color: #ef233c;
  }
`;

const MobileAuthSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const MobileGhostLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  text-align: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.06);
  font-weight: 600;
`;

const MobilePrimaryLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #ef233c;
  color: #ffffff;
  text-decoration: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 700;
`;

const MobilePrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #ef233c;
  border: none;
  color: #ffffff;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
`;
