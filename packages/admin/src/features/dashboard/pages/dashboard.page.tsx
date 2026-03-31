import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, UserPlus } from 'lucide-react';
import { StatsCard } from '../components/stats-card';
import { dashboardApi } from '../api';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Users"
          value={data?.totalUsers ?? 0}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="Active Users"
          value={data?.activeUsers ?? 0}
          icon={<UserCheck className="h-5 w-5 text-muted-foreground" />}
        />
        <StatsCard
          title="New This Month"
          value={data?.newUsersThisMonth ?? 0}
          icon={<UserPlus className="h-5 w-5 text-muted-foreground" />}
        />
      </div>
    </div>
  );
}
