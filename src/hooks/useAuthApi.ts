import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { forgotPasswordApi, resetPasswordApi, signupApi } from '../services/api/auth';
import type { ForgotPasswordParams, ResetPasswordParams } from '../types/auth';

export function useLogin() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: ({ identifier, password }: { identifier: string; password: string }) =>
      signIn(identifier, password),
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (params: { email: string; username: string; password: string; role: string }) =>
      signupApi(params),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (params: ForgotPasswordParams) => forgotPasswordApi(params),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (params: ResetPasswordParams) => resetPasswordApi(params),
  });
}
