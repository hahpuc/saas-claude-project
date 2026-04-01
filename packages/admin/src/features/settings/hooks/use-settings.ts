import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { settingsApi } from '../api/settings.api';
import type { UpdateSettingInput } from '../types/settings.types';
import type { AxiosError } from 'axios';

export function useSettingsList() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.list().then((r) => r.data.data),
    staleTime: 30_000,
  });
}

export function useUpsertSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: UpdateSettingInput }) =>
      settingsApi.upsert(key, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Setting saved successfully');
    },
    onError: (err: AxiosError<{ error: { message: string } }>) => {
      toast.error(err.response?.data?.error?.message || 'Failed to save setting');
    },
  });
}

export function useDeleteSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => settingsApi.delete(key),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Setting deleted successfully');
    },
    onError: (err: AxiosError<{ error: { message: string } }>) => {
      toast.error(err.response?.data?.error?.message || 'Failed to delete setting');
    },
  });
}
