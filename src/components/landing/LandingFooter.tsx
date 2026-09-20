import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Dumbbell, Globe } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  return (
    <FooterWrapper>
      <FooterInner>
        <FooterTop>
          {/* Brand Info */}
          <BrandCol>
            <BrandRow>
              <LogoIconWrapper>
                <Dumbbell size={20} color="#ffffff" />
              </LogoIconWrapper>
              <LogoText>
                GYMMI<span>.</span>
              </LogoText>
            </BrandRow>
            <Tagline>{t('landing.footer.tagline')}</Tagline>
          </BrandCol>

          {/* Quick Links */}
          <LinksCol>
            <LinkHeading>Platform</LinkHeading>
            <FooterLinkButton type="button" onClick={() => handleNavClick('features')}>
              {t('landing.nav.features')}
            </FooterLinkButton>
            <FooterLinkButton type="button" onClick={() => handleNavClick('ecosystem')}>
              {t('landing.nav.ecosystem')}
            </FooterLinkButton>
            <FooterLinkButton type="button" onClick={() => handleNavClick('pricing')}>
              {t('landing.nav.pricing')}
            </FooterLinkButton>
            <FooterLinkButton type="button" onClick={() => handleNavClick('faq')}>
              {t('landing.nav.faq')}
            </FooterLinkButton>
          </LinksCol>

          {/* Language / Region */}
          <LanguageCol>
            <LinkHeading>Language</LinkHeading>
            <FooterLangButton type="button" onClick={toggleLanguage}>
              <Globe size={16} />
              <span>{i18n.language.startsWith('es') ? 'Español (ES)' : 'English (EN)'}</span>
            </FooterLangButton>
          </LanguageCol>
        </FooterTop>

        <FooterBottom>
          <Copyright>{t('landing.footer.copyright')}</Copyright>
          <LegalLinks>
            <LegalText>{t('landing.footer.privacy')}</LegalText>
            <span>•</span>
            <LegalText>{t('landing.footer.terms')}</LegalText>
          </LegalLinks>
        </FooterBottom>
      </FooterInner>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  background: #060b14;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 4.5rem 1.5rem 2.5rem;
`;

const FooterInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
  }
`;

const BrandCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIconWrapper = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #ef233c 0%, #d90429 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #ffffff;

  span {
    color: #ef233c;
  }
`;

const Tagline = styled.p`
  color: #64748b;
  font-size: 0.9375rem;
  max-width: 320px;
  line-height: 1.5;
`;

const LinksCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const LinkHeading = styled.h4`
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const FooterLinkButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const LanguageCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLangButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 0.5rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  width: fit-content;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const Copyright = styled.span`
  color: #64748b;
  font-size: 0.8125rem;
`;

const LegalLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #475569;
  font-size: 0.8125rem;
`;

const LegalText = styled.span`
  color: #64748b;
`;
