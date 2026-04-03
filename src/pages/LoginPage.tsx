import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Apple, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { AxiosError } from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      console.log(axiosErr);
      setError(
        axiosErr.response?.data?.message|| axiosErr.message || 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-[40%] relative bg-[#2b2d42] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
          alt="Gym"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Gymmi
            </h1>
          </div>
          <div className="mb-16">
            <p className="text-lg text-[#edf2f4]/80 italic max-w-sm leading-relaxed">
              "The only bad workout is the one that didn't happen."
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center bg-[#edf2f4] px-12 py-12">
        <div className="w-full max-w-lg">
          {/* Mobile-only branding */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2b2d42]">Gymmi</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl" style={{ padding: '3rem' }}>
            <h2 className="text-3xl font-bold text-[#2b2d42] text-center" style={{ marginBottom: '0.25rem' }}>
              Welcome
            </h2>
            <p className="text-[#8d99ae] text-sm text-center" style={{ marginBottom: '2.5rem' }}>
              Login with Email
            </p>

            {error && (
              <p style={{ color: '#d90429', fontSize: '0.8125rem', textAlign: 'center', marginBottom: '1rem' }}>
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#8d99ae', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  placeholder="email@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '3.25rem', paddingRight: '1.25rem', paddingTop: '0.875rem', paddingBottom: '0.875rem', borderRadius: '9999px', border: '1px solid #d2d6df', backgroundColor: 'white', color: '#2b2d42', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Password */}
              <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#8d99ae', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '3.25rem', paddingRight: '3.25rem', paddingTop: '0.875rem', paddingBottom: '0.875rem', borderRadius: '9999px', border: '1px solid #d2d6df', backgroundColor: 'white', color: '#2b2d42', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#8d99ae', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
                disabled={loading}
                style={{ width: '100%', padding: '0.875rem', borderRadius: '9999px', backgroundColor: '#ef233c', color: 'white', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.05em', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#d90429'; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#ef233c'; }}
              >
                {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                {loading ? 'LOGGING IN...' : 'LOGIN'}
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
              <button
                type="button"
                style={{ color: '#ef233c', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Register Now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
