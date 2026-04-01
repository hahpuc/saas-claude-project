export interface AuditLog {
  id: string;
  userId: string | null;
  organizationId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AuditLogListParams {
  page?: number;
  limit?: number;
  search?: string;
  entityType?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
}
