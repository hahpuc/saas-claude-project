import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersApi } from '../api/users.api';
import type { UserListParams, CreateUserInput, UpdateUserInput } from '../types/user.types';
import type { AxiosError } from 'axios';

export function useUserList(params: UserListParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.list(params).then((r) => r.data.data),
    staleTime: 30_000,
  });
}

export function useUserDetail(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.detail(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserInput) => usersApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (err: AxiosError<{ error: { message: string } }>) => {
      toast.error(err.response?.data?.error?.message || 'Failed to create user');
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (err: AxiosError<{ error: { message: string } }>) => {
      toast.error(err.response?.data?.error?.message || 'Failed to update user');
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (err: AxiosError<{ error: { message: string } }>) => {
      toast.error(err.response?.data?.error?.message || 'Failed to delete user');
    },
  });
}

export function useChangeUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      usersApi.changeStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Status updated');
    },
    onError: (err: AxiosError<{ error: { message: string } }>) => {
      toast.error(err.response?.data?.error?.message || 'Failed to change status');
    },
  });
}
