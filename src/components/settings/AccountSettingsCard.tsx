import { Eye, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CardSurface, SectionTitle } from './SettingsShell';

/**
 * Account settings section with email, password, 2FA, and location sync controls.
 */
export function AccountSettingsCard() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <SectionTitle>
        <Users size={18} color="#ffb3b1" /> {t('settings.accountSettings')}
      </SectionTitle>

      <FieldGroup>
        <FieldLabel>{t('settings.emailAddress')}</FieldLabel>
        <FieldInput>
          <span>alex.volt@kinetic.performance</span>
        </FieldInput>
      </FieldGroup>

      <FieldGroup>
        <FieldLabel>{t('settings.password')}</FieldLabel>
        <FieldInput>
          <PasswordDots>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</PasswordDots>
          <EyeButton type="button" aria-label={t('settings.togglePassword')}>
            <Eye size={16} />
          </EyeButton>
        </FieldInput>
      </FieldGroup>

      <ToggleRow>
        <ToggleGroup>
          <FieldLabel>{t('settings.twoFactor')}</FieldLabel>
          <ToggleTrack $active>
            <ToggleThumb $active />
          </ToggleTrack>
          <ToggleLabel $active>{t('common.enabled')}</ToggleLabel>
        </ToggleGroup>
        <ToggleGroup>
          <FieldLabel>{t('settings.locationSync')}</FieldLabel>
          <ToggleTrack $active={false}>
            <ToggleThumb $active={false} />
          </ToggleTrack>
          <ToggleLabel $active={false}>{t('common.disabled')}</ToggleLabel>
        </ToggleGroup>
      </ToggleRow>
    </Wrapper>
  );
}

const Wrapper = styled(CardSurface)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const FieldLabel = styled.span`
  color: #9096b6;
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
`;

const FieldInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 0.7rem;
  background: #181a2e;
  color: #e0e0fc;
  font-size: 0.9rem;
`;

const PasswordDots = styled.span`
  letter-spacing: 0.15em;
  color: #e0e0fc;
`;

const EyeButton = styled.button`
  border: none;
  background: transparent;
  color: #9096b6;
  cursor: pointer;
  display: grid;
  place-items: center;
  padding: 0;
`;

const ToggleRow = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const ToggleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ToggleTrack = styled.div<{ $active: boolean }>`
  width: 2.75rem;
  height: 1.4rem;
  border-radius: 9999px;
  background: ${({ $active }) =>
    $active ? 'linear-gradient(135deg, #ffb3b1, #ff535a)' : '#313349'};
  position: relative;
  cursor: pointer;
  transition: background 200ms ease;
`;

const ToggleThumb = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 0.2rem;
  left: ${({ $active }) => ($active ? 'calc(100% - 1.2rem)' : '0.2rem')};
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background: #ffffff;
  transition: left 200ms ease;
`;

const ToggleLabel = styled.span<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? '#ffb3b1' : '#9096b6')};
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  font-weight: 600;
`;
