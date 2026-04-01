import { api } from '@/lib/axios';
import type { ApiResponse, PaginatedData } from '@/types';
import type { AuditLog, AuditLogListParams } from '../types/audit-log.types';

export const auditLogsApi = {
  list: (params: AuditLogListParams) =>
    api.get<ApiResponse<PaginatedData<AuditLog>>>('/audit-logs', { params }),

  detail: (id: string) =>
    api.get<ApiResponse<AuditLog>>(`/audit-logs/${id}`),
};
