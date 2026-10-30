import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { setAppLanguage, type AppLanguage } from '../../i18n';

type LanguageToggleProps = {
  className?: string;
};

/**
 * Globe pill showing the active language; clicking switches ES ⇄ EN and
 * saves the choice. Used on pages without the signed-in TopBar.
 */
export function LanguageToggle({ className }: LanguageToggleProps) {
  const { t, i18n } = useTranslation();
  const active: AppLanguage = i18n.language?.startsWith('en') ? 'en' : 'es';
  const next: AppLanguage = active === 'es' ? 'en' : 'es';

  return (
    <ToggleButton
      type="button"
      className={className}
      onClick={() => void setAppLanguage(next)}
      aria-label={t('language.switchTo', {
        language: t(next === 'en' ? 'language.english' : 'language.spanish'),
      })}
      title={t('language.switchTo', {
        language: t(next === 'en' ? 'language.english' : 'language.spanish'),
      })}
    >
      <Globe size={16} aria-hidden="true" />
      <span>{active.toUpperCase()}</span>
    </ToggleButton>
  );
}

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid #d2d6df;
  background-color: #ffffff;
  color: #2b2d42;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: #ef233c;
    color: #ef233c;
  }

  &:focus-visible {
    outline: 2px solid #ef233c;
    outline-offset: 2px;
  }
`;
