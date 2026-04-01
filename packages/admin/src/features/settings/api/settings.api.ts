import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types';
import type { SystemSetting, UpdateSettingInput } from '../types/settings.types';

export const settingsApi = {
  list: () =>
    api.get<ApiResponse<SystemSetting[]>>('/settings'),

  detail: (key: string) =>
    api.get<ApiResponse<SystemSetting>>(`/settings/${key}`),

  upsert: (key: string, data: UpdateSettingInput) =>
    api.put<ApiResponse<SystemSetting>>(`/settings/${key}`, data),

  delete: (key: string) =>
    api.delete(`/settings/${key}`),
};
