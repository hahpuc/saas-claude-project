import { useState, useEffect } from 'react';
import { Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  useRolesList,
  usePermissionGroups,
  useRolePermissions,
  useSetRolePermissions,
} from '../hooks/use-roles';

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800',
  admin: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
  manager: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
  user: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
};

export function RolesPage() {
  const { data: roles, isLoading: rolesLoading } = useRolesList();
  const { data: groups, isLoading: groupsLoading } = usePermissionGroups();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { data: rolePerms, isLoading: permsLoading } = useRolePermissions(selectedRole);
  const setPermissions = useSetRolePermissions();

  const [editedPermissions, setEditedPermissions] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (rolePerms?.permissions) {
      setEditedPermissions(new Set(rolePerms.permissions));
      setHasChanges(false);
    }
  }, [rolePerms]);

  // Auto-select first non-super_admin role
  useEffect(() => {
    if (roles && !selectedRole) {
      const first = roles.find((r) => r.role !== 'super_admin');
      if (first) setSelectedRole(first.role);
    }
  }, [roles, selectedRole]);

  const togglePermission = (perm: string) => {
    const next = new Set(editedPermissions);
    if (next.has(perm)) {
      next.delete(perm);
    } else {
      next.add(perm);
    }
    setEditedPermissions(next);
    setHasChanges(true);
  };

  const handleSave = () => {
    setPermissions.mutate(
      { role: selectedRole, permissions: Array.from(editedPermissions) },
      { onSuccess: () => setHasChanges(false) },
    );
  };

  const isSuperAdmin = selectedRole === 'super_admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure role-based access control for your platform.
          </p>
        </div>
        {hasChanges && !isSuperAdmin && (
          <Button onClick={handleSave} disabled={setPermissions.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {setPermissions.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      {/* Role Selector - Pills */}
      <div className="flex flex-wrap gap-2">
        {rolesLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-full" />
          ))
        ) : (
          roles?.map((r) => {
            const isSelected = selectedRole === r.role;
            const colorClass = ROLE_COLORS[r.role] || ROLE_COLORS.user;
            return (
              <button
                key={r.role}
                onClick={() => setSelectedRole(r.role)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? colorClass + ' ring-2 ring-offset-2 ring-primary/30'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                {r.role}
              </button>
            );
          })
        )}
      </div>

      {/* Role Description */}
      {roles && selectedRole && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {roles.find((r) => r.role === selectedRole)?.description}
          </p>
          {isSuperAdmin && (
            <Badge variant="secondary" className="text-xs">All permissions granted</Badge>
          )}
        </div>
      )}

      {/* Permission Groups */}
      {groupsLoading || permsLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {groups?.map((group) => (
            <Card key={group.name} className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.permissions.map((perm, idx) => (
                    <div key={perm.key}>
                      <div className="flex items-center justify-between py-1">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium">{perm.label}</Label>
                          <p className="text-xs text-muted-foreground font-mono">{perm.key}</p>
                        </div>
                        <Switch
                          checked={isSuperAdmin || editedPermissions.has(perm.key)}
                          disabled={isSuperAdmin}
                          onCheckedChange={() => togglePermission(perm.key)}
                        />
                      </div>
                      {idx < group.permissions.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
