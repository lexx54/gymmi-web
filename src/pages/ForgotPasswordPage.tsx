import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, Lock, Mail } from 'lucide-react';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useForgotPassword, useResetPassword } from '../hooks/useAuthApi';
import {
  createForgotPasswordSchema,
  createResetPasswordSchema,
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
} from '../schemas/auth';
import { RESEND_COOLDOWN_SECONDS, resolveResetErrorKey } from '../utils/passwordReset';
import { LanguageToggle } from '../components/common/LanguageToggle';

/**
 * Two-step password recovery: request a 6-digit code by email, then submit
 * the code with a new password.
 */
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: requestCode, isPending: sending } = useForgotPassword();
  const { mutate: resetPassword, isPending: resetting } = useResetPassword();

  const emailForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(createForgotPasswordSchema(t)),
    defaultValues: { email: '' },
  });
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(createResetPasswordSchema(t)),
    defaultValues: { code: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const sendCode = (target: string, onSent?: () => void) => {
    requestCode(
      { email: target },
      {
        onSuccess: () => {
          setEmail(target);
          setCooldown(RESEND_COOLDOWN_SECONDS);
          onSent?.();
        },
        onError: (err) => {
          const status = (err as AxiosError)?.response?.status;
          toast.error(t(status === 429 ? 'auth.forgot.tooManyAttempts' : 'auth.forgot.failed'));
        },
      },
    );
  };

  const onRequest = ({ email: value }: ForgotPasswordFormValues) => {
    if (sending) return;
    sendCode(value.trim());
  };

  const onResend = () => {
    if (!email || cooldown > 0 || sending) return;
    sendCode(email, () => toast.success(t('auth.forgot.resent')));
  };

  const onReset = ({ code, newPassword }: ResetPasswordFormValues) => {
    if (!email || resetting) return;
    resetPassword(
      { email, code: code.trim(), newPassword },
      {
        onSuccess: () => {
          toast.success(t('auth.forgot.success'));
          navigate('/login', { replace: true });
        },
        onError: (err) => toast.error(t(resolveResetErrorKey(err))),
      },
    );
  };

  const onChangeEmail = () => {
    setEmail(null);
    setCooldown(0);
    resetForm.reset();
  };

  const emailErrors = emailForm.formState.errors;
  const resetErrors = resetForm.formState.errors;

  return (
    <Page>
      <CornerToggle />
      <Card>
        <IconBadge aria-hidden="true">{email ? <KeyRound size={26} /> : <Lock size={26} />}</IconBadge>

        {!email ? (
          <>
            <Title>{t('auth.forgot.title')}</Title>
            <Subtitle>{t('auth.forgot.subtitle')}</Subtitle>

            <form noValidate onSubmit={emailForm.handleSubmit(onRequest)}>
              <Field>
                <Label htmlFor="forgot-email">{t('auth.emailLabel')}</Label>
                <InputWrap>
                  <InputIcon>
                    <Mail size={18} />
                  </InputIcon>
                  <Input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder={t('auth.emailPlaceholder')}
                    $invalid={!!emailErrors.email}
                    aria-invalid={!!emailErrors.email}
                    {...emailForm.register('email')}
                  />
                </InputWrap>
                {emailErrors.email && <ErrorText role="alert">{emailErrors.email.message}</ErrorText>}
              </Field>

              <PrimaryButton type="submit" disabled={sending}>
                {sending && <Spinner size={16} />}
                {sending ? t('auth.forgot.sending') : t('auth.forgot.sendCode')}
              </PrimaryButton>
            </form>
          </>
        ) : (
          <>
            <Title>{t('auth.forgot.resetTitle')}</Title>
            <Subtitle>{t('auth.forgot.resetSubtitle', { email })}</Subtitle>

            <form noValidate onSubmit={resetForm.handleSubmit(onReset)}>
              <Field>
                <Label htmlFor="reset-code">{t('auth.forgot.codeLabel')}</Label>
                <CodeInput
                  id="reset-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  autoFocus
                  placeholder="000000"
                  $invalid={!!resetErrors.code}
                  aria-invalid={!!resetErrors.code}
                  {...resetForm.register('code', {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    },
                  })}
                />
                {resetErrors.code && <ErrorText role="alert">{resetErrors.code.message}</ErrorText>}
              </Field>

              <Field>
                <Label htmlFor="reset-new-password">{t('auth.forgot.newPasswordLabel')}</Label>
                <InputWrap>
                  <InputIcon>
                    <Lock size={18} />
                  </InputIcon>
                  <Input
                    id="reset-new-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    $invalid={!!resetErrors.newPassword}
                    aria-invalid={!!resetErrors.newPassword}
                    {...resetForm.register('newPassword')}
                  />
                  <ToggleButton
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={t(showPassword ? 'auth.forgot.hidePassword' : 'auth.forgot.showPassword')}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </ToggleButton>
                </InputWrap>
                {resetErrors.newPassword && (
                  <ErrorText role="alert">{resetErrors.newPassword.message}</ErrorText>
                )}
              </Field>

              <Field>
                <Label htmlFor="reset-confirm-password">{t('auth.forgot.confirmPasswordLabel')}</Label>
                <InputWrap>
                  <InputIcon>
                    <Lock size={18} />
                  </InputIcon>
                  <Input
                    id="reset-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    $invalid={!!resetErrors.confirmPassword}
                    aria-invalid={!!resetErrors.confirmPassword}
                    {...resetForm.register('confirmPassword')}
                  />
                </InputWrap>
                {resetErrors.confirmPassword && (
                  <ErrorText role="alert">{resetErrors.confirmPassword.message}</ErrorText>
                )}
              </Field>

              <PrimaryButton type="submit" disabled={resetting}>
                {resetting && <Spinner size={16} />}
                {resetting ? t('auth.forgot.submitting') : t('auth.forgot.submit')}
              </PrimaryButton>
            </form>

            <SecondaryRow>
              <TextButton type="button" onClick={onResend} disabled={cooldown > 0 || sending}>
                {cooldown > 0 ? t('auth.forgot.resendIn', { seconds: cooldown }) : t('auth.forgot.resend')}
              </TextButton>
              <TextButton type="button" onClick={onChangeEmail}>
                {t('auth.forgot.changeEmail')}
              </TextButton>
            </SecondaryRow>
          </>
        )}

        <BackLink to="/login">
          <ArrowLeft size={16} />
          {t('auth.forgot.backToLogin')}
        </BackLink>
      </Card>
    </Page>
  );
}

const Page = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #edf2f4;
  padding: 3rem 1rem;
`;

const CornerToggle = styled(LanguageToggle)`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 28rem;
  background-color: #ffffff;
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

  @media (min-width: 640px) {
    padding: 3rem;
  }
`;

const IconBadge = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 1.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(239, 35, 60, 0.1);
  color: #ef233c;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  line-height: 2.25rem;
  font-weight: 700;
  color: #2b2d42;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #8d99ae;
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 2rem;
  overflow-wrap: anywhere;
`;

const Field = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #2b2d42;
  margin-bottom: 0.5rem;
`;

const InputWrap = styled.div`
  position: relative;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #8d99ae;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const Input = styled.input<{ $invalid?: boolean }>`
  width: 100%;
  padding: 0.875rem 3.25rem;
  border-radius: 9999px;
  border: 1px solid ${({ $invalid }) => ($invalid ? '#d90429' : '#d2d6df')};
  background-color: white;
  color: #2b2d42;
  font-size: 0.875rem;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ $invalid }) => ($invalid ? '#d90429' : '#ef233c')};
  }
`;

const CodeInput = styled(Input)`
  padding: 0.875rem 1rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5em;
  font-variant-numeric: tabular-nums;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #8d99ae;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ErrorText = styled.p`
  color: #d90429;
  font-size: 0.75rem;
  margin-top: 0.375rem;
`;

const PrimaryButton = styled.button`
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.875rem;
  border-radius: 9999px;
  background-color: #ef233c;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background-color: #d90429;
  }

  &:disabled {
    background-color: #8d99ae;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Spinner = styled(Loader2)`
  animation: spin 1s linear infinite;
`;

const SecondaryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.25rem;
`;

const TextButton = styled.button`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #ef233c;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:disabled {
    color: #8d99ae;
    cursor: default;
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 2rem;
  font-size: 0.875rem;
  color: #8d99ae;
  text-decoration: none;

  &:hover {
    color: #2b2d42;
  }
`;
