import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Dumbbell, Globe, Mail } from 'lucide-react';
import { LEGAL_CONFIG } from '../constants/legal.constants';
import { setAppLanguage } from '../i18n';

interface TermsSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  paragraphsAfter?: string[];
}

/**
 * Public Terms of Service page linked from the landing footer and used as the
 * Terms / EULA URL for the App Store and Google Play listings.
 */
export const TermsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language.startsWith('es');

  const interpolation = {
    company: LEGAL_CONFIG.companyName,
    email: LEGAL_CONFIG.contactEmail,
    minAge: LEGAL_CONFIG.minimumAge,
    jurisdiction: isSpanish ? LEGAL_CONFIG.jurisdictionEs : LEGAL_CONFIG.jurisdiction,
  };

  const sections = t('terms.sections', {
    returnObjects: true,
    ...interpolation,
  }) as TermsSection[];

  const lastUpdated = new Intl.DateTimeFormat(isSpanish ? 'es' : 'en', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(LEGAL_CONFIG.lastUpdated));

  useEffect(() => {
    const previousTitle = document.title;
    document.title = t('terms.metaTitle');
    window.scrollTo({ top: 0 });
    return () => {
      document.title = previousTitle;
    };
  }, [t]);

  const handleTocClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageWrapper>
      <Header>
        <HeaderInner>
          <LogoLink to="/">
            <LogoIcon>
              <Dumbbell size={18} color="#ffffff" />
            </LogoIcon>
            <LogoText>
              GYMMI<span>.</span>
            </LogoText>
          </LogoLink>
          <HeaderActions>
            <LangButton type="button" onClick={() => void setAppLanguage(isSpanish ? 'en' : 'es')}>
              <Globe size={15} />
              {isSpanish ? 'ES' : 'EN'}
            </LangButton>
            <BackLink to="/">
              <ArrowLeft size={16} />
              {t('terms.backHome')}
            </BackLink>
          </HeaderActions>
        </HeaderInner>
      </Header>

      <Hero>
        <Eyebrow>{t('terms.eyebrow')}</Eyebrow>
        <Title>{t('terms.title')}</Title>
        <Subtitle>{t('terms.subtitle')}</Subtitle>
        <Updated>{t('terms.lastUpdated', { date: lastUpdated })}</Updated>
      </Hero>

      <Layout>
        <Toc aria-label={t('terms.tocTitle')}>
          <TocTitle>{t('terms.tocTitle')}</TocTitle>
          <TocList>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} onClick={(event) => handleTocClick(event, section.id)}>
                  {section.title}
                </a>
              </li>
            ))}
          </TocList>
        </Toc>

        <Content>
          {sections.map((section) => (
            <Section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
              <SectionTitle id={`${section.id}-title`}>{section.title}</SectionTitle>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
              {section.paragraphsAfter?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Section>
          ))}

          <ContactCard>
            <div>
              <ContactTitle>{t('terms.contactTitle')}</ContactTitle>
              <ContactBody>{t('terms.contactBody')}</ContactBody>
            </div>
            <ContactLink href={`mailto:${LEGAL_CONFIG.contactEmail}`}>
              <Mail size={16} />
              {LEGAL_CONFIG.contactEmail}
            </ContactLink>
          </ContactCard>
        </Content>
      </Layout>

      <Footer>
        <span>{t('landing.footer.copyright')}</span>
        <Link to="/">{t('terms.backHome')}</Link>
      </Footer>
    </PageWrapper>
  );
};

export default TermsPage;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #0b1120;
  color: #f8fafc;
  overflow-x: hidden;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(11, 17, 32, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const HeaderInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
`;

const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #ef233c 0%, #d90429 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.span`
  font-size: 1.125rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #ffffff;

  span {
    color: #ef233c;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LangButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 0.45rem 0.7rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  padding: 0.45rem 0.7rem;
  border-radius: 0.5rem;

  &:hover {
    color: #ffffff;
  }
`;

const Hero = styled.section`
  max-width: 1240px;
  margin: 0 auto;
  padding: 3.5rem 1rem 2rem;
`;

const Eyebrow = styled.span`
  color: #ef233c;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Title = styled.h1`
  margin: 0.5rem 0 0.75rem;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  line-height: 1.1;
  color: #ffffff;
`;

const Subtitle = styled.p`
  max-width: 680px;
  color: #94a3b8;
  font-size: 1.0625rem;
  line-height: 1.6;
`;

const Updated = styled.p`
  margin-top: 1rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const Layout = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2rem;

  @media (min-width: 960px) {
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 3rem;
  }
`;

const Toc = styled.nav`
  display: none;

  @media (min-width: 960px) {
    display: block;
    position: sticky;
    top: 5rem;
    align-self: start;
    max-height: calc(100vh - 6rem);
    overflow-y: auto;
  }
`;

const TocTitle = styled.h2`
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const TocList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  a {
    display: block;
    color: #94a3b8;
    font-size: 0.875rem;
    line-height: 1.4;
    text-decoration: none;
    padding: 0.35rem 0.6rem;
    border-radius: 0.4rem;
    border-left: 2px solid transparent;
  }

  a:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.04);
    border-left-color: #ef233c;
  }
`;

const Content = styled.article`
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
`;

const Section = styled.section`
  scroll-margin-top: 5rem;
  color: #cbd5e1;
  font-size: 0.9875rem;
  line-height: 1.75;

  p + p,
  ul + p {
    margin-top: 0.85rem;
  }

  p {
    margin: 0;
  }

  ul {
    margin: 0.75rem 0 0;
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  li::marker {
    color: #ef233c;
  }
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 0.75rem;
`;

const ContactCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const ContactTitle = styled.h3`
  color: #ffffff;
  font-size: 1.0625rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
`;

const ContactBody = styled.p`
  color: #94a3b8;
  font-size: 0.9375rem;
  margin: 0;
`;

const ContactLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  padding: 0.65rem 1rem;
  border-radius: 0.6rem;
  background: linear-gradient(135deg, #ef233c 0%, #d90429 100%);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  overflow-wrap: anywhere;
`;

const Footer = styled.footer`
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: #060b14;
  padding: 1.75rem 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  color: #64748b;
  font-size: 0.8125rem;

  a {
    color: #94a3b8;
    text-decoration: none;
  }

  a:hover {
    color: #ffffff;
  }
`;
