import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { forgotPasswordApi, resetPasswordApi } from '../services/api/auth';
import type { ForgotPasswordParams, ResetPasswordParams } from '../types/auth';

export function useLogin() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: ({ identifier, password }: { identifier: string; password: string }) =>
      signIn(identifier, password),
  });
}

export function useSignup() {
  const { signUp } = useAuth();

  return useMutation({
    mutationFn: ({ email, username, password }: { email: string; username: string; password: string }) =>
      signUp(email, username, password),
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
