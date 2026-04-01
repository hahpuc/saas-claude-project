import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, UserPlus, Activity } from 'lucide-react';
import { StatsCard } from '../components/stats-card';
import { dashboardApi } from '../api';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '@/stores/auth.store';

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  update: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  delete: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

export function DashboardPage() {
  const { user } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
    staleTime: 30_000,
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: () => dashboardApi.getRecentActivity().then((r) => r.data.data),
    staleTime: 30_000,
  });

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsLoading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)
        ) : (
          <>
            <StatsCard
              title="Total Users"
              value={stats?.totalUsers ?? 0}
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Active Users"
              value={stats?.activeUsers ?? 0}
              icon={<UserCheck className="h-5 w-5" />}
            />
            <StatsCard
              title="New This Month"
              value={stats?.newUsersThisMonth ?? 0}
              icon={<UserPlus className="h-5 w-5" />}
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : !activity?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activity.map((item) => {
                const base = item.action.split('.').pop() || item.action;
                const colorClass = ACTION_COLORS[base] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
                return (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
                        {item.action}
                      </span>
                      <span className="text-sm">
                        <Badge variant="outline" className="mr-1.5 font-normal">{item.entityType}</Badge>
                        <span className="font-mono text-xs text-muted-foreground">
                          {item.entityId.slice(0, 8)}…
                        </span>
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
