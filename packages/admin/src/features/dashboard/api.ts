import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export interface RecentActivity {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
}

export const dashboardApi = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),

  getRecentActivity: () =>
    api.get<ApiResponse<RecentActivity[]>>('/dashboard/recent-activity'),
};
