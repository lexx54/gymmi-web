import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { loginApi, signupApi } from '../services/api/auth';
import {
  saveTokens,
  getTokens,
  clearTokens,
} from '../services/storage/tokenStorage';
import type { AuthUser } from '../types/auth';

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (email: string, username: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const { accessToken } = getTokens();
      if (!accessToken) return;

      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      setUser({
        id: payload.sub,
        email: payload.email,
        username: payload.username ?? payload.email,
      });
    } catch {
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (identifier: string, password: string) => {
    const response = await loginApi({ identifier, password });
    saveTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  };

  const signUp = async (email: string, username: string, password: string) => {
    const response = await signupApi({ email, username, password });
    saveTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  };

  const signOut = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
