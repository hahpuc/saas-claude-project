export interface RoleInfo {
  role: string;
  description: string;
}

export interface PermissionItem {
  key: string;
  label: string;
}

export interface PermissionGroup {
  name: string;
  permissions: PermissionItem[];
}

export interface RolePermissions {
  role: string;
  permissions: string[];
}
