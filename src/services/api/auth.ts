import apiClient from './client';
import type {
  AuthResponse,
  LoginParams,
  SignupParams,
  ForgotPasswordParams,
  ResetPasswordParams,
} from '../../types/auth';

export async function loginApi(params: LoginParams): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', params);
  return data;
}

export async function signupApi(params: SignupParams): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/signup', params);
  return data;
}

export async function forgotPasswordApi(
  params: ForgotPasswordParams,
): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(
    '/auth/forgot-password',
    params,
  );
  return data;
}

export async function resetPasswordApi(
  params: ResetPasswordParams,
): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(
    '/auth/reset-password',
    params,
  );
  return data;
}
