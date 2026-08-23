import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Modal } from '../common/Modal';

type CreateTagModalProps = {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

/**
 * Modal for creating a catalog tag (global for admins, private otherwise).
 */
export function CreateTagModal({
  isOpen,
  isSaving,
  onClose,
  onSubmit,
}: CreateTagModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
    }
  }, [isOpen]);

  const handleClose = () => {
    setName('');
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || isSaving) return;
    onSubmit(trimmed);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t('exercises.createTagTitle')}
      description={t('exercises.createTagDescription')}
      onClose={handleClose}
    >
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="create-tag-name">{t('exercises.tagName')}</Label>
          <Input
            id="create-tag-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('exercises.tagName')}
            autoFocus
          />
        </Field>
        <Actions>
          <SecondaryButton type="button" onClick={handleClose}>
            {t('common.cancel')}
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={!name.trim() || isSaving}>
            {isSaving ? t('common.loading') : t('exercises.saveTag')}
          </PrimaryButton>
        </Actions>
      </Form>
    </Modal>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.5rem;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.span`
  color: #e7bdbb;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const Input = styled.input`
  border: 1px solid rgba(93, 63, 62, 0.45);
  border-radius: 0.9rem;
  background: #181a2e;
  color: #f7f7ff;
  padding: 0.85rem 1rem;
  outline: none;

  &:focus {
    border-color: #ffb3b1;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const SecondaryButton = styled.button`
  border: 0;
  border-radius: 999px;
  background: #313349;
  color: #ffdad6;
  cursor: pointer;
  font-weight: 900;
  padding: 0.85rem 1.2rem;
  text-transform: uppercase;
`;

const PrimaryButton = styled.button`
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #ffb3b1 0%, #ff535a 100%);
  color: #2a0911;
  cursor: pointer;
  font-weight: 900;
  padding: 0.85rem 1.3rem;
  text-transform: uppercase;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;
