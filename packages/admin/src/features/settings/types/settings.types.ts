export interface SystemSetting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingInput {
  value: unknown;
  description?: string;
}
