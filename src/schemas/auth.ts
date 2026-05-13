import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const SIGNUP_ROLES = ['Gym', 'Trainer', 'Client'] as const;

export const signupSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    username: z.string().min(1, 'Username is required').min(3, 'Username must be at least 3 characters'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    role: z.enum(SIGNUP_ROLES, { required_error: 'Select a role' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
