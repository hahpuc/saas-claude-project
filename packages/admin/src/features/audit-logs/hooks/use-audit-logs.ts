import { useQuery } from '@tanstack/react-query';
import { auditLogsApi } from '../api/audit-logs.api';
import type { AuditLogListParams } from '../types/audit-log.types';

export function useAuditLogList(params: AuditLogListParams) {
  return useQuery({
    queryKey: ['auditLogs', params],
    queryFn: () => auditLogsApi.list(params).then((r) => r.data.data),
    staleTime: 30_000,
  });
}

export function useAuditLogDetail(id: string) {
  return useQuery({
    queryKey: ['auditLogs', id],
    queryFn: () => auditLogsApi.detail(id).then((r) => r.data.data),
    enabled: !!id,
  });
}
