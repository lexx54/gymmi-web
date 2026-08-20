import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { setAppLanguage, type AppLanguage } from '../../i18n';
import { CardSurface, SectionTitle } from './SettingsShell';

const languageOptions: Array<{ language: AppLanguage; labelKey: string }> = [
  { language: 'en', labelKey: 'language.english' },
  { language: 'es', labelKey: 'language.spanish' },
];

/**
 * Device-level language preference for the Gymmi web UI.
 */
export function LanguageSettingsCard() {
  const { i18n, t } = useTranslation();
  const activeLanguage: AppLanguage = i18n.language.startsWith('es') ? 'es' : 'en';

  const handleLanguageChange = (language: AppLanguage) => {
    if (language !== activeLanguage) {
      void setAppLanguage(language);
    }
  };

  return (
    <Wrapper>
      <SectionTitle>
        <Languages size={18} color="#ffb3b1" /> {t('language.title')}
      </SectionTitle>
      <Description>{t('language.description')}</Description>
      <SegmentedControl aria-label={t('language.title')}>
        {languageOptions.map((option) => (
          <LanguageButton
            key={option.language}
            type="button"
            $active={option.language === activeLanguage}
            aria-pressed={option.language === activeLanguage}
            onClick={() => handleLanguageChange(option.language)}
          >
            {t(option.labelKey)}
          </LanguageButton>
        ))}
      </SegmentedControl>
    </Wrapper>
  );
}

const Wrapper = styled(CardSurface)`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const Description = styled.p`
  margin: 0;
  color: #9096b6;
  font-size: 0.85rem;
`;

const SegmentedControl = styled.div`
  display: inline-flex;
  width: fit-content;
  overflow: hidden;
  border-radius: 0.75rem;
  border: 1px solid rgba(126, 136, 175, 0.18);
  background: #181a2e;
`;

const LanguageButton = styled.button<{ $active: boolean }>`
  border: none;
  padding: 0.65rem 1.1rem;
  background: ${({ $active }) => ($active ? '#313349' : 'transparent')};
  color: ${({ $active }) => ($active ? '#f5f6ff' : '#9096b6')};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
`;
