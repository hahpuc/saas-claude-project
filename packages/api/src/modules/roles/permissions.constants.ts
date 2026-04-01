export const PERMISSIONS = {
  // User management
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_MANAGE_STATUS: 'users.manage_status',

  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_MANAGE: 'settings.manage',

  // Audit Logs
  AUDIT_LOGS_VIEW: 'audit_logs.view',

  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',

  // Uploads
  UPLOADS_MANAGE: 'uploads.manage',

  // Notifications
  NOTIFICATIONS_VIEW: 'notifications.view',

  // Roles
  ROLES_VIEW: 'roles.view',
  ROLES_MANAGE: 'roles.manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ALL_PERMISSIONS,
  admin: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_MANAGE_STATUS,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.AUDIT_LOGS_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.UPLOADS_MANAGE,
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.ROLES_VIEW,
  ],
  manager: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.UPLOADS_MANAGE,
    PERMISSIONS.NOTIFICATIONS_VIEW,
  ],
  user: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW,
  ],
};

export const PERMISSION_GROUPS = [
  {
    name: 'Users',
    permissions: [
      { key: PERMISSIONS.USERS_VIEW, label: 'View users' },
      { key: PERMISSIONS.USERS_CREATE, label: 'Create users' },
      { key: PERMISSIONS.USERS_UPDATE, label: 'Update users' },
      { key: PERMISSIONS.USERS_DELETE, label: 'Delete users' },
      { key: PERMISSIONS.USERS_MANAGE_STATUS, label: 'Manage user status' },
    ],
  },
  {
    name: 'Settings',
    permissions: [
      { key: PERMISSIONS.SETTINGS_VIEW, label: 'View settings' },
      { key: PERMISSIONS.SETTINGS_MANAGE, label: 'Manage settings' },
    ],
  },
  {
    name: 'Audit Logs',
    permissions: [
      { key: PERMISSIONS.AUDIT_LOGS_VIEW, label: 'View audit logs' },
    ],
  },
  {
    name: 'Dashboard',
    permissions: [
      { key: PERMISSIONS.DASHBOARD_VIEW, label: 'View dashboard' },
    ],
  },
  {
    name: 'Uploads',
    permissions: [
      { key: PERMISSIONS.UPLOADS_MANAGE, label: 'Manage file uploads' },
    ],
  },
  {
    name: 'Notifications',
    permissions: [
      { key: PERMISSIONS.NOTIFICATIONS_VIEW, label: 'View notifications' },
    ],
  },
  {
    name: 'Roles',
    permissions: [
      { key: PERMISSIONS.ROLES_VIEW, label: 'View roles & permissions' },
      { key: PERMISSIONS.ROLES_MANAGE, label: 'Manage roles & permissions' },
    ],
  },
];
