import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}

export function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/60 rounded-l-lg" />
      <CardContent className="p-5 pl-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold tracking-tight text-foreground">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
