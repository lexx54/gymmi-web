export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: { id: string; name: string };
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type LoginParams = {
  identifier: string;
  password: string;
};

export type SignupParams = {
  email: string;
  username: string;
  password: string;
  role: string;
};

export type ForgotPasswordParams = {
  email: string;
};

export type ResetPasswordParams = {
  email: string;
  code: string;
  newPassword: string;
};
