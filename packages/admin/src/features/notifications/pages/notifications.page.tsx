import { useState } from 'react';
import { CheckCheck, Trash } from 'lucide-react';
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline" onClick={() => markAllAsRead.mutate()}>
          <CheckCheck className="mr-2 h-4 w-4" /> Mark All Read
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

      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))
        ) : !data?.items.length ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No notifications
            </CardContent>
          </Card>
        ) : (
          data.items.map((notification) => (
            <Card
              key={notification.id}
              className={notification.readAt ? 'opacity-60' : ''}
            >
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{notification.title}</span>
                    {!notification.readAt && (
                      <Badge variant="default" className="text-[10px]">New</Badge>
                    )}
                    <Badge variant="outline" className="text-[10px]">{notification.type}</Badge>
                  </div>
                  {notification.content && (
                    <p className="text-sm text-muted-foreground">{notification.content}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!notification.readAt && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead.mutate(notification.id)}
                    >
                      Mark read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
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
