import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rolesApi } from '../api/roles.api';
import type { AxiosError } from 'axios';

export function useRolesList() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesApi.listRoles().then((r) => r.data.data),
    staleTime: 60_000,
  });
}

export function usePermissionGroups() {
  return useQuery({
    queryKey: ['roles', 'permissionGroups'],
    queryFn: () => rolesApi.getPermissionGroups().then((r) => r.data.data),
    staleTime: 60_000,
  });
}

export function useRolePermissions(role: string) {
  return useQuery({
    queryKey: ['roles', role, 'permissions'],
    queryFn: () => rolesApi.getRolePermissions(role).then((r) => r.data.data),
    enabled: !!role,
  });
}

export function useSetRolePermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ role, permissions }: { role: string; permissions: string[] }) =>
      rolesApi.setRolePermissions(role, permissions),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['roles', variables.role, 'permissions'] });
      toast.success('Permissions updated successfully');
    },
    onError: (err: AxiosError<{ error: { message: string } }>) => {
      toast.error(err.response?.data?.error?.message || 'Failed to update permissions');
    },
  });
}
