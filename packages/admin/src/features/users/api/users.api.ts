import { api } from '@/lib/axios';
import type { ApiResponse, PaginatedData, User } from '@/types';
import type { UserListParams, CreateUserInput, UpdateUserInput } from '../types/user.types';

export const usersApi = {
  list: (params: UserListParams) =>
    api.get<ApiResponse<PaginatedData<User>>>('/users', { params }),

  detail: (id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`),

  create: (data: CreateUserInput) =>
    api.post<ApiResponse<User>>('/users', data),

  update: (id: string, data: UpdateUserInput) =>
    api.patch<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: string) =>
    api.delete(`/users/${id}`),

  changeStatus: (id: string, status: string) =>
    api.patch<ApiResponse<User>>(`/users/${id}/status`, { status }),
};
