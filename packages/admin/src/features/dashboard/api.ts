import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export const dashboardApi = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
};
