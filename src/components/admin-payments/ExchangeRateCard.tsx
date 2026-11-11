import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, DollarSign } from 'lucide-react';
import {
  fetchAdminExchangeRates,
  setAdminExchangeRate,
} from '../../services/api/payments';
import { getApiErrorMessage } from '../../services/api/errors';
import { caracasToday, formatRate, parseRateInput } from '../../utils/billing';

/** Admin form to enter the official BCV USD rate (replaces the old scraper). */
export function ExchangeRateCard() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [rateText, setRateText] = useState('');
  const [validFor, setValidFor] = useState(() => caracasToday());

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'exchange-rates'],
    queryFn: fetchAdminExchangeRates,
  });

  const mutation = useMutation({
    mutationFn: setAdminExchangeRate,
    onSuccess: (saved) => {
      toast.success(
        t('admin.payments.rate.savedToast', {
          rate: formatRate(saved.rate),
          date: saved.validFor,
          defaultValue: 'BCV rate saved: {{rate}} VES for {{date}}.',
        }),
      );
      setRateText('');
      queryClient.invalidateQueries({ queryKey: ['admin', 'exchange-rates'] });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('admin.payments.rate.saveFailed', 'Could not save the rate.'),
        ),
      );
    },
  });

  const parsedRate = parseRateInput(rateText);
  const invalid = rateText.trim() !== '' && parsedRate === null;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (parsedRate === null || !validFor) return;
    mutation.mutate({ rate: parsedRate, validFor });
  };

  const current = data?.current ?? null;
  const recent = data?.history.slice(0, 5) ?? [];

  return (
    <Card aria-labelledby="bcv-rate-title">
      <Header>
        <Title id="bcv-rate-title">
          <DollarSign size={16} />
          {t('admin.payments.rate.title', 'BCV exchange rate')}
        </Title>
        {isLoading ? null : current ? (
          <CurrentRate>
            {t('admin.payments.rate.current', {
              rate: formatRate(current.rate),
              date: current.validFor,
              defaultValue: '1 USD = {{rate}} VES · since {{date}}',
            })}
          </CurrentRate>
        ) : (
          <Warning role="status">
            <AlertTriangle size={14} />
            {t('admin.payments.rate.missing', {
              days: data?.maxAgeDays ?? 5,
              defaultValue:
                'No rate from the last {{days}} days. Bolívar payments are paused until you enter one.',
            })}
          </Warning>
        )}
      </Header>

      <Form onSubmit={onSubmit}>
        <Field>
          <Label htmlFor="bcv-rate-input">
            {t('admin.payments.rate.rateLabel', 'VES per 1 USD')}
          </Label>
          <Input
            id="bcv-rate-input"
            inputMode="decimal"
            autoComplete="off"
            placeholder="481,25"
            value={rateText}
            aria-invalid={invalid}
            onChange={(e) => setRateText(e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="bcv-rate-date">
            {t('admin.payments.rate.dateLabel', 'Valid from (Fecha Valor)')}
          </Label>
          <Input
            id="bcv-rate-date"
            type="date"
            value={validFor}
            onChange={(e) => setValidFor(e.target.value)}
          />
        </Field>
        <SaveButton
          type="submit"
          disabled={parsedRate === null || !validFor || mutation.isPending}
        >
          {mutation.isPending
            ? t('common.saving', 'Saving...')
            : t('admin.payments.rate.save', 'Save rate')}
        </SaveButton>
      </Form>
      {invalid ? (
        <ErrorText>
          {t('admin.payments.rate.invalid', 'Enter a positive number, e.g. 481,25.')}
        </ErrorText>
      ) : null}
      <Hint>
        {t(
          'admin.payments.rate.hint',
          'Copy the USD rate from bcv.org.ve. Entering a rate for a date that already has one replaces it.',
        )}
      </Hint>

      {recent.length > 0 ? (
        <History>
          {recent.map((row) => (
            <li key={row.validFor}>
              <span>{row.validFor}</span>
              <strong>{formatRate(row.rate)}</strong>
            </li>
          ))}
        </History>
      ) : null}
    </Card>
  );
}

const Card = styled.section`
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #0f1220;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const Title = styled.h2`
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 800;
`;

const CurrentRate = styled.span`
  color: #34d399;
  font-size: 0.875rem;
  font-weight: 700;
`;

const Warning = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #f59e0b;
  font-size: 0.8125rem;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 160px;
  flex: 1 1 160px;
  max-width: 240px;
`;

const Label = styled.label`
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 700;
`;

const Input = styled.input`
  padding: 0.55rem 0.8rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #111827;
  color: #ffffff;
  font-size: 0.9rem;
  outline: none;
  color-scheme: dark;

  &:focus {
    border-color: #ef233c;
  }

  &[aria-invalid='true'] {
    border-color: #f87171;
  }
`;

const SaveButton = styled.button`
  padding: 0.6rem 1.25rem;
  border-radius: 0.625rem;
  border: none;
  background: #ef233c;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  margin: 0;
  color: #f87171;
  font-size: 0.75rem;
`;

const Hint = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.75rem;
`;

const History = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  li {
    display: inline-flex;
    gap: 0.4rem;
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.04);
    font-size: 0.75rem;
    color: #94a3b8;
  }

  strong {
    color: #cbd5e1;
  }
`;
