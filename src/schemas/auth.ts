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

export const SIGNUP_ROLES = ['Client', 'Trainer', 'Gym'] as const;

export type SignupRole = (typeof SIGNUP_ROLES)[number];

export const createStep1Schema = (t: TFunction) =>
  z
    .object({
      email: z
        .string()
        .min(1, t('auth.validation.emailRequired'))
        .email(t('auth.validation.emailInvalid')),
      username: z
        .string()
        .min(1, t('auth.validation.usernameRequired'))
        .min(3, t('auth.validation.usernameLength')),
      password: z
        .string()
        .min(1, t('auth.validation.passwordRequired'))
        .min(8, t('auth.validation.passwordLength', { count: 8 })),
      confirmPassword: z
        .string()
        .min(1, t('auth.validation.confirmPasswordRequired')),
      role: z.enum(SIGNUP_ROLES, { message: t('auth.validation.roleRequired') }),
      avatarUrl: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.validation.passwordMismatch'),
      path: ['confirmPassword'],
    });

export const createStep2Schema = (t: TFunction, isTrainer = false) =>
  z.object({
    age: z
      .number({ message: t('auth.validation.ageRequired') })
      .min(14, t('auth.validation.ageMin'))
      .max(100, t('auth.validation.ageMax')),
    gender: z.string().min(1, t('auth.validation.genderRequired')),
    height: z
      .number({ message: t('auth.validation.heightRequired') })
      .positive(t('auth.validation.heightPositive')),
    weight: z
      .number({ message: t('auth.validation.weightRequired') })
      .positive(t('auth.validation.weightPositive')),
    goal: isTrainer
      ? z.string().optional()
      : z.string().min(1, t('auth.validation.goalRequired')),
  });

export const createStep2GymSchema = (t: TFunction) =>
  z.object({
    gymName: z.string().min(2, t('auth.validation.gymNameMin')),
    gymDescription: z.string().optional(),
    gymAddress: z.string().optional(),
    gymCity: z.string().optional(),
    gymWebsiteUrl: z.string().optional(),
    gymPhoneNumber: z.string().optional(),
    gymAmenities: z.array(z.string()).optional(),
    gymCoverUrl: z.string().optional(),
  });

export const createStep3TrainerSchema = (t: TFunction) =>
  z.object({
    description: z
      .string()
      .min(10, t('auth.validation.descriptionMin')),
    monthlyPrice: z
      .number({ message: t('auth.validation.priceRequired') })
      .min(0, t('auth.validation.pricePositive')),
    specializations: z
      .array(z.string())
      .min(1, t('auth.validation.specializationsMin')),
    gyms: z.array(z.string()).max(3, t('auth.validation.gymsMax')).optional(),
    logoUrl: z.string().optional(),
  });

export const createSignupSchema = (t: TFunction) =>
  z
    .object({
      email: z
        .string()
        .min(1, t('auth.validation.emailRequired'))
        .email(t('auth.validation.emailInvalid')),
      username: z
        .string()
        .min(1, t('auth.validation.usernameRequired'))
        .min(3, t('auth.validation.usernameLength')),
      password: z
        .string()
        .min(1, t('auth.validation.passwordRequired'))
        .min(8, t('auth.validation.passwordLength', { count: 8 })),
      confirmPassword: z
        .string()
        .min(1, t('auth.validation.confirmPasswordRequired')),
      role: z.enum(SIGNUP_ROLES, { message: t('auth.validation.roleRequired') }),
      avatarUrl: z.string().optional(),
      // Step 2 fields for Client / Trainer
      age: z.number().optional(),
      gender: z.string().optional(),
      height: z.number().optional(),
      weight: z.number().optional(),
      goal: z.string().optional(),
      // Step 3 fields (Trainer only)
      description: z.string().optional(),
      monthlyPrice: z.number().optional(),
      specializations: z.array(z.string()).optional(),
      gyms: z.array(z.string()).optional(),
      logoUrl: z.string().optional(),
      // Step 2 fields (Gym only)
      gymName: z.string().optional(),
      gymDescription: z.string().optional(),
      gymAddress: z.string().optional(),
      gymCity: z.string().optional(),
      gymWebsiteUrl: z.string().optional(),
      gymPhoneNumber: z.string().optional(),
      gymAmenities: z.array(z.string()).optional(),
      gymCoverUrl: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.validation.passwordMismatch'),
      path: ['confirmPassword'],
    })
    .superRefine((data, ctx) => {
      if (data.role === 'Client' || data.role === 'Trainer') {
        if (data.age === undefined || Number.isNaN(data.age)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('auth.validation.ageRequired'),
            path: ['age'],
          });
        } else if (data.age < 14) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('auth.validation.ageMin'),
            path: ['age'],
          });
        } else if (data.age > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('auth.validation.ageMax'),
            path: ['age'],
          });
        }

        if (!data.gender || !data.gender.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('auth.validation.genderRequired'),
            path: ['gender'],
          });
        }

        if (data.height === undefined || Number.isNaN(data.height) || data.height <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('auth.validation.heightRequired'),
            path: ['height'],
          });
        }

        if (data.weight === undefined || Number.isNaN(data.weight) || data.weight <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('auth.validation.weightRequired'),
            path: ['weight'],
          });
        }
      }

      if (data.role === 'Client') {
        if (!data.goal || !data.goal.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('auth.validation.goalRequired'),
            path: ['goal'],
          });
        }
      }

      if (data.role === 'Trainer') {
        if (!data.description || data.description.trim().length < 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('auth.validation.descriptionMin'),
            path: ['description'],
          });
        }
        if (data.monthlyPrice === undefined || data.monthlyPrice < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('auth.validation.priceRequired'),
            path: ['monthlyPrice'],
          });
        }
        if (!data.specializations || data.specializations.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('auth.validation.specializationsMin'),
            path: ['specializations'],
          });
        }
      }

      if (data.role === 'Gym') {
        if (!data.gymName || data.gymName.trim().length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('auth.validation.gymNameMin'),
            path: ['gymName'],
          });
        }
      }
    });

export type SignupFormValues = z.infer<ReturnType<typeof createSignupSchema>>;

