export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string | null;
  data: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  readStatus?: 'all' | 'read' | 'unread';
}
