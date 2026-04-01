import { api } from '@/lib/axios';
import type { ApiResponse, PaginatedData } from '@/types';
import type { Notification, NotificationListParams } from '../types/notification.types';

export const notificationsApi = {
  list: (params: NotificationListParams) =>
    api.get<ApiResponse<PaginatedData<Notification>>>('/notifications', { params }),

  unreadCount: () =>
    api.get<ApiResponse<{ count: number }>>('/notifications/unread-count'),

  markAsRead: (id: string) =>
    api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.post<ApiResponse<{ message: string }>>('/notifications/read-all'),

  delete: (id: string) =>
    api.delete(`/notifications/${id}`),
};
