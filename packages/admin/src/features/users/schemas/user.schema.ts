import { z } from 'zod';
import { Role } from '@/types';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(Role).optional().default(Role.USER),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email').optional(),
  name: z.string().min(2).optional(),
  role: z.nativeEnum(Role).optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
