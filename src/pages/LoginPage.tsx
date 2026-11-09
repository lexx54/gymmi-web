import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../hooks/useAuthApi';
import { createLoginSchema, type LoginFormValues } from '../schemas/auth';
import { LanguageToggle } from '../components/common/LanguageToggle';
import { GymmiLogo } from '../components/common/GymmiLogo';
import {
  AuthBrandPanel,
  BrandFeatureList,
  BrandHeadline,
  BrandWordmark,
} from '../components/auth/AuthBrandPanel';

const LOCKOUT_DURATION = 180_000;

const INVALID_CREDENTIAL_PHRASES = [
  'incorrect email, username or password',
  'correo, usuario o contraseña incorrectos',
  'invalid email/password',
  'correo/contraseña',
  'invalid credentials',
  'credenciales inválidas',
  'no account found',
  'no se encontró ninguna cuenta',
  'user not found',
  'usuario no encontrado',
  'incorrect password',
  'contraseña incorrecta',
  'wrong password',
];

export const resolveLoginErrorMessage = (
  rawMessage: string | undefined,
  t: (key: string, options?: any) => string,
): string => {
  if (!rawMessage) return t('auth.loginFailed');
  const normalized = rawMessage.toLowerCase();
  if (
    normalized.includes('deactivated') ||
    normalized.includes('desactivada')
  ) {
    return t('auth.accountInactive');
  }
  // Unknown account and wrong password share one message so the login form
  // never reveals which emails or usernames exist (older API wording included).
  if (INVALID_CREDENTIAL_PHRASES.some((phrase) => normalized.includes(phrase))) {
    return t('auth.invalidCredentials');
  }
  return rawMessage;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const { mutate: login, isPending: loading } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: { identifier: '', password: '' },
  });

  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const diff = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (diff <= 0) {
        setLockedUntil(null);
        setRemainingSeconds(0);
      } else {
        setRemainingSeconds(diff);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const isLocked = remainingSeconds > 0;
  const disabled = loading || isLocked;

  const formatCountdown = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const lockoutMessage = isLocked
    ? t('auth.lockout', { time: formatCountdown(remainingSeconds) })
    : '';

  const onSubmit = (data: LoginFormValues) => {
    if (disabled) return;
    login(
      { identifier: data.identifier, password: data.password },
      {
        onSuccess: () => {
          navigate('/dashboard');
        },
        onError: (err) => {
          const ax = err as AxiosError<{ message: string }>;
          if (ax.response?.status === 429) {
            setLockedUntil(Date.now() + LOCKOUT_DURATION);
            return;
          }
          const rawMessage =
            ax.response?.data?.message ||
            (err instanceof Error ? err.message : '');
          toast.error(resolveLoginErrorMessage(rawMessage, t));
        },
      },
    );
  };

  return (
    <PageContainer>
      {/* Left Panel - Brand */}
      <AuthBrandPanel>
        <BrandHeadline>
          {t('auth.brandHeadline')} <em>{t('auth.brandHeadlineAccent')}</em>
          <br />
          {t('auth.brandHeadlineSecond')}
        </BrandHeadline>
        <BrandFeatureList>
          <li>{t('auth.brandFeatures.routines')}</li>
          <li>{t('auth.brandFeatures.tracking')}</li>
          <li>{t('auth.brandFeatures.trainer')}</li>
        </BrandFeatureList>
      </AuthBrandPanel>

      {/* Right Panel - Form */}
      <FormPanel>
        <CornerToggle />
        <FormInner>
          {/* Mobile-only branding */}
          <MobileBrand>
            <GymmiLogo size={40} />
            <BrandWordmark $dark>Gymmi</BrandWordmark>
          </MobileBrand>

          <FormTitle>{t('auth.signIn')}</FormTitle>
          <FormSubtitle>
            {t('auth.newToGymmi')}{' '}
            <AccentLink to="/signup">{t('auth.createAccount')}</AccentLink>
          </FormSubtitle>

          {lockoutMessage && <LockoutText role="alert">{lockoutMessage}</LockoutText>}

          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <InputWrap>
                <InputIcon>
                  <Mail size={18} />
                </InputIcon>
                <Input
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  aria-label={t('auth.identifierLabel')}
                  autoComplete="email"
                  $invalid={!!errors.identifier}
                  {...register('identifier')}
                />
              </InputWrap>
              {errors.identifier && <ErrorText>{errors.identifier.message}</ErrorText>}
            </div>

            {/* Password */}
            <div>
              <InputWrap>
                <InputIcon>
                  <Lock size={18} />
                </InputIcon>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.passwordPlaceholder')}
                  aria-label={t('auth.passwordLabel')}
                  autoComplete="current-password"
                  $invalid={!!errors.password}
                  $withTrailing
                  {...register('password')}
                />
                <TrailingButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={t(showPassword ? 'auth.forgot.hidePassword' : 'auth.forgot.showPassword')}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </TrailingButton>
              </InputWrap>
              {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
            </div>

            <ForgotRow>
              <MutedLink to="/forgot-password">{t('auth.forgotPassword')}</MutedLink>
            </ForgotRow>

            <SubmitButton type="submit" disabled={disabled}>
              {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {isLocked
                ? t('auth.wait', { time: formatCountdown(remainingSeconds) })
                : loading
                  ? t('auth.loggingIn')
                  : t('auth.login')}
            </SubmitButton>
          </Form>
        </FormInner>
      </FormPanel>
    </PageContainer>
  );
}

const INK = '#2b2d42';
const RED = '#ef233c';
const RED_DARK = '#d90429';
const MIST = '#edf2f4';
const GREY = '#8d99ae';

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
`;

const FormPanel = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 1.5rem 3rem;

  @media (min-width: 640px) {
    padding: 3rem;
  }
`;

const CornerToggle = styled(LanguageToggle)`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
`;

const FormInner = styled.div`
  width: 100%;
  max-width: 26rem;
`;

const MobileBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 2.5rem;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const FormTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 2rem;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${INK};
`;

const FormSubtitle = styled.p`
  margin: 0 0 2rem;
  font-size: 0.875rem;
  color: ${GREY};
`;

const AccentLink = styled(Link)`
  color: ${RED};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: ${RED_DARK};
    text-decoration: underline;
  }
`;

const MutedLink = styled(Link)`
  font-size: 0.8125rem;
  color: ${GREY};
  text-decoration: none;

  &:hover {
    color: ${INK};
  }
`;

const LockoutText = styled.p`
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  background-color: rgba(217, 4, 41, 0.08);
  color: ${RED_DARK};
  font-size: 0.8125rem;
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const InputWrap = styled.div`
  position: relative;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${GREY};
  display: flex;
  pointer-events: none;
`;

const Input = styled.input<{ $invalid?: boolean; $withTrailing?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  padding: 0.9375rem ${({ $withTrailing }) => ($withTrailing ? '3rem' : '1rem')} 0.9375rem 2.875rem;
  border-radius: 0.625rem;
  border: 1px solid ${({ $invalid }) => ($invalid ? RED_DARK : 'transparent')};
  background-color: ${MIST};
  color: ${INK};
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.15s, background-color 0.15s, box-shadow 0.15s;

  &::placeholder {
    color: ${GREY};
  }

  &:focus {
    background-color: #ffffff;
    border-color: ${({ $invalid }) => ($invalid ? RED_DARK : INK)};
    box-shadow: 0 0 0 3px ${({ $invalid }) => ($invalid ? 'rgba(217, 4, 41, 0.15)' : 'rgba(43, 45, 66, 0.12)')};
  }
`;

const TrailingButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  padding: 0.25rem;
  border: none;
  border-radius: 0.375rem;
  background: none;
  color: ${GREY};
  cursor: pointer;

  &:hover {
    color: ${INK};
  }

  &:focus-visible {
    outline: 2px solid ${INK};
    outline-offset: 1px;
  }
`;

const ErrorText = styled.p`
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  color: ${RED_DARK};
`;

const ForgotRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -0.25rem;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.9375rem;
  border: none;
  border-radius: 0.625rem;
  background-color: ${INK};
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background-color 0.15s, transform 0.1s;

  &:hover:not(:disabled) {
    background-color: #1d1e2e;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(239, 35, 60, 0.45);
    outline-offset: 2px;
  }

  &:disabled {
    background-color: ${GREY};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

