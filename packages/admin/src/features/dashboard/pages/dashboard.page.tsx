import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, UserPlus, Activity } from 'lucide-react';
import { StatsCard } from '../components/stats-card';
import { dashboardApi } from '../api';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  update: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  delete: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function DashboardPage() {
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {statsLoading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <StatsCard
              title="Total Users"
              value={stats?.totalUsers ?? 0}
              icon={<Users className="h-5 w-5 text-muted-foreground" />}
            />
            <StatsCard
              title="Active Users"
              value={stats?.activeUsers ?? 0}
              icon={<UserCheck className="h-5 w-5 text-muted-foreground" />}
            />
            <StatsCard
              title="New This Month"
              value={stats?.newUsersThisMonth ?? 0}
              icon={<UserPlus className="h-5 w-5 text-muted-foreground" />}
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !activity?.length ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No recent activity
            </p>
          ) : (
            <div className="space-y-3">
              {activity.map((item) => {
                const base = item.action.split('.').pop() || item.action;
                const colorClass = ACTION_COLORS[base] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
                return (
                  <div key={item.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
                        {item.action}
                      </span>
                      <span className="text-sm">
                        <Badge variant="outline" className="mr-1">{item.entityType}</Badge>
                        <span className="font-mono text-xs text-muted-foreground">
                          {item.entityId.slice(0, 8)}...
                        </span>
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
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
