# Authentication & Authorization Skill

## When to Use
Use this skill for:
- JWT token management
- User registration and login flows
- Password reset flows
- Role-based access control (RBAC)
- OAuth integrations
- Session management

## Auth Architecture

### JWT Strategy
```
Client → Login → Server validates credentials → Returns access + refresh tokens
Client → API Request → Sends access token in Authorization header
Client → Token expired → Uses refresh token to get new access token
Client → Refresh expired → Redirects to login
```

### Token Configuration
```typescript
// Access Token: Short-lived, in memory
{
  expiresIn: '15m',
  secret: process.env.JWT_ACCESS_SECRET,
}

// Refresh Token: Long-lived, httpOnly cookie
{
  expiresIn: '7d',
  secret: process.env.JWT_REFRESH_SECRET,
}
```

### Auth Module Structure
```
modules/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   ├── jwt.strategy.ts
│   ├── jwt-refresh.strategy.ts
│   └── local.strategy.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   └── local-auth.guard.ts
├── decorators/
│   ├── current-user.decorator.ts
│   ├── roles.decorator.ts
│   └── public.decorator.ts
└── dto/
    ├── login.dto.ts
    ├── register.dto.ts
    └── refresh-token.dto.ts
```

### RBAC Implementation
```typescript
// Roles enum
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

// Usage on endpoints:
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('admin/users')
async getAdminUsers() { ... }
```

### Password Hashing
```typescript
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;
const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

## Frontend Auth Flow
```typescript
// stores/auth.store.ts — Zustand
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// Axios interceptor for auto-refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await authStore.getState().refreshToken();
      return axiosInstance(error.config);
    }
    return Promise.reject(error);
  }
);
```
