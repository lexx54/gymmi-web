import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Apple, Loader2 } from 'lucide-react';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import styled from 'styled-components';
import { useLogin } from '../hooks/useAuthApi';
import { loginSchema, type LoginFormValues } from '../schemas/auth';

const LOCKOUT_DURATION = 180_000;

const errorTextStyle = { color: '#d90429', fontSize: '0.75rem', marginTop: '0.375rem' } as const;

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const { mutate: login, isPending: loading } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
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
    ? `Too many attempts. Try again in ${formatCountdown(remainingSeconds)}`
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
          toast.error(
            ax.response?.data?.message ||
              (err instanceof Error ? err.message : '') ||
              'Login failed. Please try again.',
          );
        },
      },
    );
  };

  return (
    <PageContainer>
      {/* Left Panel - Hero */}
      <HeroPanel>
        <HeroImage
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
          alt="Gym"
        />
        <HeroContent>
          <div>
            <HeroTitle>Gymmi</HeroTitle>
          </div>
          <HeroFooter>
            <HeroQuote>"The only bad workout is the one that didn't happen."</HeroQuote>
          </HeroFooter>
        </HeroContent>
      </HeroPanel>

      {/* Right Panel - Form */}
      <FormPanel>
        <FormInner>
          {/* Mobile-only branding */}
          <MobileBrand>
            <MobileBrandTitle>Gymmi</MobileBrandTitle>
          </MobileBrand>

          <FormCard style={{ padding: '3rem' }}>
            <FormTitle style={{ marginBottom: '0.25rem' }}>Welcome</FormTitle>
            <FormSubtitle style={{ marginBottom: '2.5rem' }}>Login with Email</FormSubtitle>

            {lockoutMessage && (
              <p style={{ color: '#d90429', fontSize: '0.8125rem', textAlign: 'center', marginBottom: '1rem' }}>
                {lockoutMessage}
              </p>
            )}

            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#8d99ae', display: 'flex', alignItems: 'center' }}>
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    placeholder="email@mail.com"
                    autoComplete="email"
                    {...register('identifier')}
                    style={{ width: '100%', paddingLeft: '3.25rem', paddingRight: '1.25rem', paddingTop: '0.875rem', paddingBottom: '0.875rem', borderRadius: '9999px', border: errors.identifier ? '1px solid #d90429' : '1px solid #d2d6df', backgroundColor: 'white', color: '#2b2d42', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                {errors.identifier && <p style={errorTextStyle}>{errors.identifier.message}</p>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#8d99ae', display: 'flex', alignItems: 'center' }}>
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    {...register('password')}
                    style={{ width: '100%', paddingLeft: '3.25rem', paddingRight: '3.25rem', paddingTop: '0.875rem', paddingBottom: '0.875rem', borderRadius: '9999px', border: errors.password ? '1px solid #d90429' : '1px solid #d2d6df', backgroundColor: 'white', color: '#2b2d42', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#8d99ae', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p style={errorTextStyle}>{errors.password.message}</p>}
              </div>

              {/* Forgot Password */}
              <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  style={{ fontSize: '0.75rem', color: '#8d99ae', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  Forgot your password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={disabled}
                style={{ width: '100%', padding: '0.875rem', borderRadius: '9999px', backgroundColor: disabled ? '#8d99ae' : '#ef233c', color: 'white', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.05em', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = '#d90429'; }}
                onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = disabled ? '#8d99ae' : '#ef233c'; }}
              >
                {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                {isLocked ? `WAIT ${formatCountdown(remainingSeconds)}` : loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#d2d6df' }} />
              <span style={{ fontSize: '0.75rem', color: '#8d99ae', textTransform: 'uppercase' }}>Or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#d2d6df' }} />
            </div>

            {/* Social Login */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem' }}>
              <button
                type="button"
                style={{ width: '2.75rem', height: '2.75rem', borderRadius: '9999px', backgroundColor: 'white', border: '1px solid #d2d6df', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <svg viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button
                type="button"
                style={{ width: '2.75rem', height: '2.75rem', borderRadius: '9999px', backgroundColor: '#1877F2', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <svg viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }} fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button
                type="button"
                style={{ width: '2.75rem', height: '2.75rem', borderRadius: '9999px', backgroundColor: 'black', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Apple size={20} color="white" />
              </button>
            </div>

            {/* Sign Up */}
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#8d99ae', marginTop: '2rem' }}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                style={{ color: '#ef233c', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}
              >
                Register Now
              </Link>
            </p>
          </FormCard>
        </FormInner>
      </FormPanel>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const HeroPanel = styled.div`
  display: none;
  position: relative;
  overflow: hidden;
  background-color: #2b2d42;

  @media (min-width: 1024px) {
    display: flex;
    width: 40%;
  }
`;

const HeroImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem;
  width: 100%;
`;

const HeroTitle = styled.h1`
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.025em;
`;

const HeroFooter = styled.div`
  margin-bottom: 4rem;
`;

const HeroQuote = styled.p`
  font-size: 1.125rem;
  line-height: 1.625;
  color: rgba(237, 242, 244, 0.8);
  font-style: italic;
  max-width: 24rem;
`;

const FormPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #edf2f4;
  padding: 3rem;
`;

const FormInner = styled.div`
  width: 100%;
  max-width: 32rem;
`;

const MobileBrand = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileBrandTitle = styled.h1`
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  color: #2b2d42;
`;

const FormCard = styled.div`
  background-color: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  color: #2b2d42;
  text-align: center;
`;

const FormSubtitle = styled.p`
  color: #8d99ae;
  font-size: 0.875rem;
  text-align: center;
`;
