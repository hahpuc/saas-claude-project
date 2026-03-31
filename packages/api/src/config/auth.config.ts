import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'change-me-access',
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-refresh',
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
}));
