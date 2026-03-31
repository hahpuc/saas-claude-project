import type { User, Role, UserStatus } from '@/types';

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  status?: UserStatus;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  role?: Role;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
  role?: Role;
  status?: UserStatus;
  avatarUrl?: string;
}

export type { User };
