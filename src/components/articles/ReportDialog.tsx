import { Flag, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import styled from 'styled-components';
import { useReportContent } from '../../hooks/useModeration';
import {
  REPORT_REASONS,
  type ReportReason,
  type ReportTargetType,
} from '../../types/moderation';

interface ReportDialogProps {
  targetType: ReportTargetType;
  targetId: string;
  onClose: () => void;
}

export function ReportDialog({ targetType, targetId, onClose }: ReportDialogProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState('');
  const reportMutation = useReportContent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    try {
      await reportMutation.mutateAsync({
        targetType,
        targetId,
        payload: { reason, ...(details.trim() ? { details: details.trim() } : {}) },
      });
      toast.success(t('articles.moderation.reported'));
      onClose();
    } catch {
      toast.error(t('articles.moderation.reportFailed'));
    }
  };

  return (
    <Backdrop
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      data-testid="report-dialog-backdrop"
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-dialog-title"
        onClick={(e) => e.stopPropagation()}
        data-testid="report-dialog"
      >
        <CloseBtn type="button" onClick={onClose} aria-label={t('articles.moderation.cancel')}>
          <X size={18} />
        </CloseBtn>
        <Title id="report-dialog-title">
          <Flag size={18} color="#ef233c" />
          {t('articles.moderation.reportTitle')}
        </Title>
        <Subtitle>{t('articles.moderation.reportSubtitle')}</Subtitle>

        <form onSubmit={handleSubmit}>
          <Fieldset>
            <Legend>{t('articles.moderation.reasonLabel')}</Legend>
            {REPORT_REASONS.map((value) => (
              <ReasonOption key={value} $selected={reason === value}>
                <input
                  type="radio"
                  name="report-reason"
                  value={value}
                  checked={reason === value}
                  onChange={() => setReason(value)}
                  data-testid={`report-reason-${value}`}
                />
                <span>{t(`articles.moderation.reasons.${value}`)}</span>
              </ReasonOption>
            ))}
          </Fieldset>

          <DetailsLabel htmlFor="report-details">
            {t('articles.moderation.detailsLabel')}
          </DetailsLabel>
          <DetailsInput
            id="report-details"
            rows={3}
            maxLength={1000}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={t('articles.moderation.detailsPlaceholder')}
            data-testid="report-details-input"
          />

          <Actions>
            <SecondaryBtn type="button" onClick={onClose}>
              {t('articles.moderation.cancel')}
            </SecondaryBtn>
            <PrimaryBtn
              type="submit"
              disabled={!reason || reportMutation.isPending}
              data-testid="report-submit-btn"
            >
              {t('articles.moderation.submit')}
            </PrimaryBtn>
          </Actions>
        </form>
      </Card>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 12, 24, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 1rem;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 440px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  background: #1a1f3a;
  border: 1px solid rgba(126, 136, 175, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 0.85rem;
  right: 0.85rem;
  background: transparent;
  border: none;
  color: #7c84aa;
  cursor: pointer;

  &:hover {
    color: #f7f7ff;
  }
`;

const Title = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.35rem;
  font-size: 1.1rem;
  color: #f7f7ff;
`;

const Subtitle = styled.p`
  margin: 0 0 1rem;
  font-size: 0.84rem;
  color: #a3aac8;
  line-height: 1.45;
`;

const Fieldset = styled.fieldset`
  border: none;
  margin: 0 0 1rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Legend = styled.legend`
  font-size: 0.8rem;
  font-weight: 600;
  color: #cbd0e2;
  margin-bottom: 0.5rem;
`;

const ReasonOption = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.6rem;
  border: 1px solid ${(p) => (p.$selected ? '#ef233c' : 'rgba(126, 136, 175, 0.2)')};
  background: ${(p) => (p.$selected ? 'rgba(239, 35, 60, 0.1)' : '#141830')};
  color: #f7f7ff;
  font-size: 0.86rem;
  cursor: pointer;

  input {
    accent-color: #ef233c;
  }
`;

const DetailsLabel = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #cbd0e2;
  margin-bottom: 0.4rem;
`;

const DetailsInput = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  background: #141830;
  border: 1px solid rgba(126, 136, 175, 0.2);
  border-radius: 0.6rem;
  color: #f7f7ff;
  font-family: inherit;
  font-size: 0.86rem;
  padding: 0.6rem 0.75rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #ef233c;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1.25rem;
`;

const SecondaryBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(126, 136, 175, 0.3);
  color: #cbd0e2;
  border-radius: 0.6rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const PrimaryBtn = styled.button`
  background: #ef233c;
  border: none;
  color: #ffffff;
  border-radius: 0.6rem;
  padding: 0.5rem 1rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
