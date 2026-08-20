import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createLoginSchema = (t: TFunction) =>
  z.object({
    identifier: z
      .string()
      .min(1, t('auth.validation.identifierRequired'))
      .email(t('auth.validation.emailInvalid')),
    password: z
      .string()
      .min(1, t('auth.validation.passwordRequired'))
      .min(6, t('auth.validation.passwordLength', { count: 6 })),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export const SIGNUP_ROLES = ['Gym', 'Trainer', 'Client'] as const;

export const createSignupSchema = (t: TFunction) =>
  z
    .object({
      email: z.string().min(1, t('auth.validation.emailRequired')).email(t('auth.validation.emailInvalid')),
      username: z
        .string()
        .min(1, t('auth.validation.usernameRequired'))
        .min(3, t('auth.validation.usernameLength')),
      password: z
        .string()
        .min(1, t('auth.validation.passwordRequired'))
        .min(8, t('auth.validation.passwordLength', { count: 8 })),
      confirmPassword: z.string().min(1, t('auth.validation.confirmPasswordRequired')),
      role: z.enum(SIGNUP_ROLES, { message: t('auth.validation.roleRequired') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.validation.passwordMismatch'),
      path: ['confirmPassword'],
    });

export type SignupFormValues = z.infer<ReturnType<typeof createSignupSchema>>;
