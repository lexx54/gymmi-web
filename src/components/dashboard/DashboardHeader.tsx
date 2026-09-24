import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type DashboardHeaderProps = {
  username: string;
};

/**
 * Renders the introductory hero copy for the dashboard.
 */
export function DashboardHeader({ username }: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <Container>
      <SectionLabel>{t('dashboard.label')}</SectionLabel>
      <Greeting>{t('dashboard.greeting', { username: username.toUpperCase() })}</Greeting>
      <Headline>
        {t('dashboard.headlinePrefix')}{' '}
        <AccentLine>{t('dashboard.accent')}</AccentLine>{' '}
        {t('dashboard.headlineSuffix')}
      </Headline>
    </Container>
  );
}

const Container = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

const SectionLabel = styled.p`
  margin: 0;
  color: #efc0c4;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const Greeting = styled.p`
  margin: 0;
  color: #efc0c4;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.42em;
  text-transform: uppercase;
`;

const Headline = styled.h1`
  color: #f4f5ff;
  margin: 0;
  font-size: clamp(2.5rem, 4.2vw, 4.6rem);
  line-height: 1.05;
  font-style: italic;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  width: 100%;
`;

const AccentLine = styled.span`
  color: #ef233c;
  display: inline;
`;

