import { Bell, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useNotificationList, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from '../hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
  const navigate = useNavigate();
  const { data: unreadCount } = useUnreadCount();
  const { data } = useNotificationList({ page: 1, limit: 5, readStatus: 'unread' });
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = data?.items ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-[18px] w-[18px]" />
          {!!unreadCount && unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground animate-in zoom-in-50 duration-200">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-sm font-semibold">Notifications</span>
          {!!unreadCount && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-primary hover:text-primary"
              onClick={() => markAllAsRead.mutate()}
            >
              <Check className="mr-1 h-3 w-3" /> Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center px-3 py-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <span className="text-sm text-muted-foreground">No new notifications</span>
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex cursor-pointer flex-col items-start gap-1.5 px-3 py-2.5"
              onClick={() => markAsRead.mutate(notification.id)}
            >
              <span className="text-sm font-medium">{notification.title}</span>
              {notification.content && (
                <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {notification.content}
                </span>
              )}
              <span className="text-[11px] text-muted-foreground/70">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center py-2.5 text-sm font-medium text-primary hover:text-primary"
          onClick={() => navigate('/notifications')}
        >
          View all notifications <ExternalLink className="ml-1.5 h-3 w-3" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
