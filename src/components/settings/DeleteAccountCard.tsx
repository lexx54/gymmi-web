import { useState, type FormEvent } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import styled from 'styled-components';
import { CardSurface, SectionTitle } from './SettingsShell';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { deleteAccountApi } from '../../services/api/user';
import { getApiErrorMessage } from '../../services/api/errors';

const CONFIRM_WORD = 'DELETE';

/**
 * Danger zone: permanent, user-initiated account deletion (App Store 5.1.1(v) /
 * Google Play). Requires the current password plus typing a confirmation word,
 * then signs the user out.
 */
export function DeleteAccountCard() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canSubmit = password.length > 0 && confirmText.trim() === CONFIRM_WORD && !isDeleting;

  const close = () => {
    if (isDeleting) return;
    setIsOpen(false);
    setPassword('');
    setConfirmText('');
    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAccountApi(password);
    } catch (err) {
      setError(getApiErrorMessage(err, t('settings.deleteAccount.error')));
      setIsDeleting(false);
      return;
    }
    toast.success(t('settings.deleteAccount.success'));
    queryClient.clear();
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <Wrapper data-testid="delete-account-card">
      <SectionTitle>
        <AlertTriangle size={18} color="#ff535a" /> {t('settings.deleteAccount.title')}
      </SectionTitle>
      <Row>
        <Text>{t('settings.deleteAccount.description')}</Text>
        <DangerButton type="button" onClick={() => setIsOpen(true)} data-testid="delete-account-btn">
          <Trash2 size={15} />
          <span>{t('settings.deleteAccount.button')}</span>
        </DangerButton>
      </Row>

      <Modal
        isOpen={isOpen}
        title={t('settings.deleteAccount.modalTitle')}
        description={t('settings.deleteAccount.modalDescription')}
        onClose={close}
      >
        <Form onSubmit={handleSubmit}>
          <List>
            <li>{t('settings.deleteAccount.consequenceData')}</li>
            <li>{t('settings.deleteAccount.consequenceMedia')}</li>
            <li>{t('settings.deleteAccount.consequencePayments')}</li>
          </List>
          <Label>
            {t('settings.deleteAccount.passwordLabel')}
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="delete-account-password"
              disabled={isDeleting}
            />
          </Label>
          <Label>
            {t('settings.deleteAccount.confirmLabel', { word: CONFIRM_WORD })}
            <Input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              data-testid="delete-account-confirm"
              disabled={isDeleting}
            />
          </Label>
          {error ? <ErrorText role="alert">{error}</ErrorText> : null}
          <Actions>
            <CancelButton type="button" onClick={close} disabled={isDeleting}>
              {t('settings.deleteAccount.cancel')}
            </CancelButton>
            <DangerButton type="submit" disabled={!canSubmit} data-testid="delete-account-submit">
              <Trash2 size={15} />
              <span>
                {isDeleting ? t('settings.deleteAccount.deleting') : t('settings.deleteAccount.confirm')}
              </span>
            </DangerButton>
          </Actions>
        </Form>
      </Modal>
    </Wrapper>
  );
}

const Wrapper = styled(CardSurface)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-color: rgba(239, 35, 60, 0.35);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Text = styled.p`
  margin: 0;
  max-width: 42rem;
  font-size: 0.84rem;
  line-height: 1.5;
  color: #c0c5e4;
`;

const DangerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: #ef233c;
  border: 1px solid #ef233c;
  border-radius: 0.6rem;
  color: #ffffff;
  padding: 0.5rem 0.95rem;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 140ms ease;

  &:hover:not(:disabled) {
    background: #ff3b52;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid rgba(126, 136, 175, 0.35);
  border-radius: 0.6rem;
  color: #c0c5e4;
  padding: 0.5rem 0.95rem;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-top: 1rem;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  color: #e7bdbb;
  font-size: 0.84rem;
  line-height: 1.6;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #c0c5e4;
`;

const Input = styled.input`
  background: #121630;
  border: 1px solid rgba(126, 136, 175, 0.3);
  border-radius: 0.6rem;
  color: #f7f7ff;
  padding: 0.6rem 0.8rem;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #ef233c;
  }
`;

const ErrorText = styled.p`
  margin: 0;
  color: #ff535a;
  font-size: 0.82rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;
