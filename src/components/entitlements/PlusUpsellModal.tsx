import { Check, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ApiErrorDetails } from '../../services/api/errors';
import type { EntitlementResource } from '../../types/rbac';
import { Modal } from '../common/Modal';

type PlusUpsellModalProps = {
  isOpen: boolean;
  details?: ApiErrorDetails;
  resource?: EntitlementResource;
  message?: string;
  onClose: () => void;
};

/** Displays a billing-free Plus explanation for a plan-limited action. */
export function PlusUpsellModal({
  isOpen,
  details,
  resource,
  message,
  onClose,
}: PlusUpsellModalProps) {
  const { t } = useTranslation();
  const target = details?.resource ?? resource;

  return (
    <Modal
      isOpen={isOpen}
      title={t('entitlements.upsellTitle')}
      description={message ?? (typeof details?.message === 'string' ? details.message : undefined)}
      onClose={onClose}
    >
      <Content>
        <PlanLabel><Sparkles size={16} aria-hidden />{t('entitlements.plus')}</PlanLabel>
        <Benefits>
          <li><Check size={16} aria-hidden />{t('entitlements.benefits.templates')}</li>
          <li><Check size={16} aria-hidden />{t('entitlements.benefits.exercises')}</li>
          <li><Check size={16} aria-hidden />{t('entitlements.benefits.sharing')}</li>
        </Benefits>
        {target && typeof details?.limit === 'number' ? (
          <Usage>
            {t('entitlements.usage', {
              usage: details.usage ?? details.limit,
              limit: details.limit,
            })}
          </Usage>
        ) : null}
        <Actions>
          <CloseButton type="button" onClick={onClose}>{t('common.close')}</CloseButton>
        </Actions>
      </Content>
    </Modal>
  );
}

const Content = styled.div`display: grid; gap: 1rem; margin-top: 1.5rem;`;
const PlanLabel = styled.p`display: flex; align-items: center; gap: .5rem; margin: 0; color: #ffb3b1; font-weight: 900;`;
const Benefits = styled.ul`display: grid; gap: .7rem; margin: 0; padding: 0; list-style: none; color: #e0e0fc; li { display: flex; align-items: center; gap: .55rem; } svg { color: #7ee7a8; }`;
const Usage = styled.p`margin: 0; color: #e7bdbb; font-size: .85rem;`;
const Actions = styled.div`display: flex; justify-content: flex-end;`;
const CloseButton = styled.button`border: 0; border-radius: 999px; padding: .75rem 1.2rem; background: #313349; color: #fff; font-weight: 800; cursor: pointer;`;
