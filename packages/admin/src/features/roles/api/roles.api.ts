import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { RoleInfo, PermissionGroup, RolePermissions } from '../types/roles.types';

export const rolesApi = {
  listRoles: () =>
    api.get<ApiResponse<RoleInfo[]>>('/roles'),

  getPermissionGroups: () =>
    api.get<ApiResponse<PermissionGroup[]>>('/roles/permissions'),

  getRolePermissions: (role: string) =>
    api.get<ApiResponse<RolePermissions>>(`/roles/${role}/permissions`),

  setRolePermissions: (role: string, permissions: string[]) =>
    api.put<ApiResponse<RolePermissions>>(`/roles/${role}/permissions`, { permissions }),
};
