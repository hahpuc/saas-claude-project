# API Endpoints Plan

## Auth Endpoints
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /api/v1/auth/register | Register new user | Public |
| POST | /api/v1/auth/login | Login with email/password | Public |
| POST | /api/v1/auth/refresh | Refresh access token | Cookie |
| POST | /api/v1/auth/logout | Logout (revoke refresh token) | JWT |
| POST | /api/v1/auth/forgot-password | Request password reset | Public |
| POST | /api/v1/auth/reset-password | Reset password with token | Public |
| GET | /api/v1/auth/me | Get current user profile | JWT |
| PATCH | /api/v1/auth/me | Update current user profile | JWT |
| POST | /api/v1/auth/change-password | Change password | JWT |

## User Management (Admin)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/v1/users | List users (paginated) | Admin |
| GET | /api/v1/users/:id | Get user details | Admin |
| POST | /api/v1/users | Create user | Admin |
| PATCH | /api/v1/users/:id | Update user | Admin |
| DELETE | /api/v1/users/:id | Soft delete user | SuperAdmin |
| PATCH | /api/v1/users/:id/status | Change user status | Admin |
| POST | /api/v1/users/:id/reset-password | Admin reset user password | Admin |

## Organization Management
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/v1/organizations | List organizations | Admin |
| GET | /api/v1/organizations/:id | Get organization details | Admin |
| POST | /api/v1/organizations | Create organization | Admin |
| PATCH | /api/v1/organizations/:id | Update organization | Admin |
| DELETE | /api/v1/organizations/:id | Delete organization | SuperAdmin |
| GET | /api/v1/organizations/:id/members | List members | Admin |
| POST | /api/v1/organizations/:id/members | Add member | Admin |
| DELETE | /api/v1/organizations/:id/members/:userId | Remove member | Admin |

## Plans & Billing
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/v1/plans | List available plans | Public |
| GET | /api/v1/plans/:id | Get plan details | Public |
| POST | /api/v1/plans | Create plan | SuperAdmin |
| PATCH | /api/v1/plans/:id | Update plan | SuperAdmin |
| DELETE | /api/v1/plans/:id | Delete plan | SuperAdmin |

## System Settings (Admin)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/v1/settings | Get all settings | Admin |
| GET | /api/v1/settings/:key | Get setting by key | Admin |
| PUT | /api/v1/settings/:key | Update setting | SuperAdmin |

## Audit Logs
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/v1/audit-logs | List audit logs (paginated) | Admin |
| GET | /api/v1/audit-logs/:id | Get audit log details | Admin |

## Notifications
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/v1/notifications | List user notifications | JWT |
| PATCH | /api/v1/notifications/:id/read | Mark as read | JWT |
| POST | /api/v1/notifications/read-all | Mark all as read | JWT |
| DELETE | /api/v1/notifications/:id | Delete notification | JWT |

## File Upload
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /api/v1/uploads | Upload file | JWT |
| DELETE | /api/v1/uploads/:id | Delete file | JWT |

## Dashboard / Stats
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/v1/dashboard/stats | Get dashboard statistics | Admin |
| GET | /api/v1/dashboard/recent-activity | Get recent activity | Admin |
| GET | /api/v1/dashboard/charts/:type | Get chart data | Admin |
