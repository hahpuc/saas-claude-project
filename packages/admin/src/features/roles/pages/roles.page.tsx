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
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
        {hasChanges && !isSuperAdmin && (
          <Button onClick={handleSave} disabled={setPermissions.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {setPermissions.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      {/* Role Selector */}
      <div className="flex flex-wrap gap-2">
        {rolesLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28" />
          ))
        ) : (
          roles?.map((r) => (
            <Button
              key={r.role}
              variant={selectedRole === r.role ? 'default' : 'outline'}
              onClick={() => setSelectedRole(r.role)}
              className="gap-2"
            >
              <Shield className="h-4 w-4" />
              {r.role}
            </Button>
          ))
        )}
      </div>

      {/* Role Description */}
      {roles && selectedRole && (
        <p className="text-sm text-muted-foreground">
          {roles.find((r) => r.role === selectedRole)?.description}
          {isSuperAdmin && (
            <Badge variant="secondary" className="ml-2">All permissions granted</Badge>
          )}
        </p>
      )}

      {/* Permission Groups */}
      {groupsLoading || permsLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {groups?.map((group) => (
            <Card key={group.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.permissions.map((perm, idx) => (
                    <div key={perm.key}>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">{perm.label}</Label>
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
