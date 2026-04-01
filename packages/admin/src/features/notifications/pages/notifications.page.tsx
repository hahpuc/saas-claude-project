import { useState } from 'react';
import { CheckCheck, Trash, Bell as BellIcon, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useNotificationList,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from '../hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';

export function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');

  const { data, isLoading } = useNotificationList({
    page,
    limit: 20,
    readStatus: readFilter,
  });

  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated with system events and alerts.
          </p>
        </div>
        <Button variant="outline" onClick={() => markAllAsRead.mutate()} className="gap-2">
          <CheckCheck className="h-4 w-4" /> Mark All Read
        </Button>
      </div>

      <div className="flex gap-3">
        <Select value={readFilter} onValueChange={(v) => { setReadFilter(v as typeof readFilter); setPage(1); }}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : !data?.items.length ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <BellOff className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">No notifications</p>
              <p className="text-sm text-muted-foreground/70 mt-1">You're all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          data.items.map((notification) => (
            <Card
              key={notification.id}
              className={`shadow-sm transition-all duration-200 hover:shadow-md ${
                notification.readAt
                  ? 'opacity-60 hover:opacity-80'
                  : 'border-l-[3px] border-l-primary'
              }`}
            >
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div className="flex gap-3 flex-1">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    notification.readAt ? 'bg-muted' : 'bg-primary/10'
                  }`}>
                    <BellIcon className={`h-4 w-4 ${notification.readAt ? 'text-muted-foreground' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{notification.title}</span>
                      {!notification.readAt && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0">New</Badge>
                      )}
                      <Badge variant="outline" className="text-[10px]">{notification.type}</Badge>
                    </div>
                    {notification.content && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{notification.content}</p>
                    )}
                    <p className="text-xs text-muted-foreground/70">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!notification.readAt && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => markAsRead.mutate(notification.id)}
                    >
                      Mark read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteNotification.mutate(notification.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
