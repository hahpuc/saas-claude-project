import { useState } from 'react';
import { Plus, Pencil, Trash, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSettingsList, useUpsertSetting, useDeleteSetting } from '../hooks/use-settings';
import type { SystemSetting } from '../types/settings.types';
import { format } from 'date-fns';

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
}

function parseValue(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

export function SettingsPage() {
  const { data: settings, isLoading } = useSettingsList();
  const upsertMutation = useUpsertSetting();
  const deleteMutation = useDeleteSetting();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [editKey, setEditKey] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isNew, setIsNew] = useState(false);

  const openCreate = () => {
    setIsNew(true);
    setEditKey('');
    setEditValue('');
    setEditDescription('');
    setEditOpen(true);
  };

  const openEdit = (setting: SystemSetting) => {
    setIsNew(false);
    setEditKey(setting.key);
    setEditValue(formatValue(setting.value));
    setEditDescription(setting.description || '');
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!editKey.trim()) return;
    upsertMutation.mutate(
      {
        key: editKey.trim(),
        data: {
          value: parseValue(editValue),
          description: editDescription || undefined,
        },
      },
      { onSuccess: () => setEditOpen(false) },
    );
  };

  const handleDelete = () => {
    if (deleteKey) {
      deleteMutation.mutate(deleteKey, { onSuccess: () => setDeleteKey(null) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage system-wide configuration and preferences.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Setting
        </Button>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold">Key</TableHead>
              <TableHead className="font-semibold">Value</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Updated</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : !settings?.length ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <SettingsIcon className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No settings configured yet</p>
                </TableCell>
              </TableRow>
            ) : (
              settings.map((setting) => (
                <TableRow key={setting.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-sm font-medium">{setting.key}</TableCell>
                  <TableCell className="max-w-[300px]">
                    <pre className="truncate text-xs text-muted-foreground">
                      {formatValue(setting.value)}
                    </pre>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {setting.description || '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(setting.updatedAt), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(setting)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteKey(setting.key)}>
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit / Create Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNew ? 'Add Setting' : 'Edit Setting'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Key</Label>
              <Input
                value={editKey}
                onChange={(e) => setEditKey(e.target.value)}
                placeholder="e.g. site.name"
                disabled={!isNew}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label>Value (JSON or plain text)</Label>
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder='e.g. "My SaaS" or {"enabled": true}'
                rows={5}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="What this setting does"
                className="h-10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={upsertMutation.isPending || !editKey.trim()}>
              {upsertMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteKey} onOpenChange={(open) => !open && setDeleteKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Setting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the setting &quot;{deleteKey}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteKey(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
