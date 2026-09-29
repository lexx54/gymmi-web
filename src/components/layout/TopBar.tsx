import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { setAppLanguage, type AppLanguage } from '../../i18n';

export type TopBarProps = {
  title?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/**
 * Standardized top bar providing the page title on the left
 * and utility actions (actions slot and language toggle pill) on the right.
 */
export function TopBar({ title, actions, className }: TopBarProps) {
  const { i18n } = useTranslation();
  const activeLanguage: AppLanguage = i18n.language?.startsWith('es') ? 'es' : 'en';

  const handleLanguageChange = (language: AppLanguage) => {
    if (language !== activeLanguage) {
      void setAppLanguage(language);
    }
  };

  return (
    <TopBarContainer className={className} $hasTitle={Boolean(title)}>
      {title ? (
        typeof title === 'string' ? (
          <TitleHeading>{title}</TitleHeading>
        ) : (
          title
        )
      ) : (
        <Spacer />
      )}
      <RightControls>
        {actions && <ActionsSlot>{actions}</ActionsSlot>}
        <LanguagePill role="group" aria-label="Language selection">
          <LangButton
            type="button"
            $active={activeLanguage === 'en'}
            aria-pressed={activeLanguage === 'en'}
            onClick={() => handleLanguageChange('en')}
            data-testid="lang-btn-en"
          >
            EN
          </LangButton>
          <LangButton
            type="button"
            $active={activeLanguage === 'es'}
            aria-pressed={activeLanguage === 'es'}
            onClick={() => handleLanguageChange('es')}
            data-testid="lang-btn-es"
          >
            ES
          </LangButton>
        </LanguagePill>
      </RightControls>
    </TopBarContainer>
  );
}

const TopBarContainer = styled.header<{ $hasTitle: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  margin-bottom: ${({ $hasTitle }) => ($hasTitle ? '0.5rem' : '0')};

  @media (max-width: 640px) {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
`;

const TitleHeading = styled.h1`
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #f5f6ff;
  letter-spacing: -0.01em;

  @media (max-width: 640px) {
    font-size: 1.3rem;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-shrink: 0;
  margin-left: auto;
`;

const ActionsSlot = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const LanguagePill = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 3px;
  border-radius: 9999px;
  background: #181a2e;
  border: 1px solid rgba(126, 136, 175, 0.22);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

const LangButton = styled.button<{ $active: boolean }>`
  border: none;
  background: ${({ $active }) => ($active ? '#313349' : 'transparent')};
  color: ${({ $active }) => ($active ? '#f5f6ff' : '#9096b6')};
  font-family: inherit;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.35rem 0.7rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease, transform 150ms ease;

  &:hover {
    color: #f5f6ff;
  }

  ${({ $active }) =>
    $active &&
    `
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  `}
`;
