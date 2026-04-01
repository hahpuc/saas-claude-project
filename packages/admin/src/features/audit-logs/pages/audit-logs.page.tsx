import { useState } from 'react';
import { Search, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuditLogList } from '../hooks/use-audit-logs';
import type { AuditLog } from '../types/audit-log.types';
import { format } from 'date-fns';

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  update: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  delete: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

function truncateId(id: string | null): string {
  if (!id) return '—';
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

export function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [detailLog, setDetailLog] = useState<AuditLog | null>(null);

  const { data, isLoading } = useAuditLogList({
    page,
    limit: 20,
    search: search || undefined,
    entityType: entityTypeFilter !== 'all' ? entityTypeFilter : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const getActionBadgeClass = (action: string) => {
    const base = action.split('.').pop() || action;
    return ACTION_COLORS[base] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and review all system activities and changes.
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by action..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={entityTypeFilter} onValueChange={(v) => { setEntityTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Entity Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="setting">Setting</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-[160px]"
              placeholder="Start date"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-[160px]"
              placeholder="End date"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold">Timestamp</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">Entity Type</TableHead>
              <TableHead className="font-semibold">Entity ID</TableHead>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : !data?.items.length ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No audit logs found</p>
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.entityType}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{truncateId(log.entityId)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.userId ? truncateId(log.userId) : 'System'}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailLog(log)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

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

      {/* Detail Dialog */}
      <Dialog open={!!detailLog} onOpenChange={(open) => !open && setDetailLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Detail</DialogTitle>
          </DialogHeader>
          {detailLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</span>
                  <p>{detailLog.action}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timestamp</span>
                  <p>{format(new Date(detailLog.createdAt), 'MMM d, yyyy HH:mm:ss')}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entity Type</span>
                  <p>{detailLog.entityType}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entity ID</span>
                  <p className="font-mono text-xs">{detailLog.entityId}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User ID</span>
                  <p className="font-mono text-xs">{detailLog.userId || 'System'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">IP Address</span>
                  <p>{detailLog.ipAddress || '—'}</p>
                </div>
              </div>
              {detailLog.userAgent && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User Agent</span>
                  <p className="truncate text-xs text-muted-foreground">{detailLog.userAgent}</p>
                </div>
              )}
              {detailLog.oldValues && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Previous Values</span>
                  <pre className="max-h-48 overflow-auto rounded-lg bg-muted p-3 text-xs">
                    {JSON.stringify(detailLog.oldValues, null, 2)}
                  </pre>
                </div>
              )}
              {detailLog.newValues && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Values</span>
                  <pre className="max-h-48 overflow-auto rounded-lg bg-muted p-3 text-xs">
                    {JSON.stringify(detailLog.newValues, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
