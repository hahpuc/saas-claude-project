import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AdminLayout } from '@/layouts/admin.layout';
import { AuthLayout } from '@/layouts/auth.layout';
import { LoginPage } from '@/features/auth/pages/login.page';
import { DashboardPage } from '@/features/dashboard/pages/dashboard.page';
import { UsersListPage } from '@/features/users/pages/users-list.page';
import { UserEditPage } from '@/features/users/pages/user-edit.page';
import { ProfilePage } from '@/features/profile/pages/profile.page';
import { SettingsPage } from '@/features/settings/pages/settings.page';
import { AuditLogsPage } from '@/features/audit-logs/pages/audit-logs.page';
import { NotificationsPage } from '@/features/notifications/pages/notifications.page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersListPage />} />
            <Route path="/users/:id" element={<UserEditPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
