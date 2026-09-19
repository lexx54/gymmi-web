import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useEntitlements } from '../../hooks/usePermissions';

/** Shows the server-provided downgrade grace deadline when present. */
export function EntitlementGraceWarning() {
  const { t, i18n } = useTranslation();
  const { data: entitlements } = useEntitlements();
  const effectiveAt = entitlements?.downgradeEffectiveAt;

  if (!effectiveAt) return null;

  const date = new Date(effectiveAt);
  const formattedDate = Number.isNaN(date.getTime())
    ? effectiveAt
    : new Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);

  return (
    <Warning role="status">
      <AlertTriangle size={18} aria-hidden />
      <span>{t('entitlements.graceWarning', { date: formattedDate })}</span>
    </Warning>
  );
}

const Warning = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  margin: 1rem 0;
  border: 1px solid rgba(255, 199, 116, 0.4);
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
  background: rgba(90, 68, 26, 0.35);
  color: #ffd59a;
  font-size: 0.88rem;
  line-height: 1.45;
`;
