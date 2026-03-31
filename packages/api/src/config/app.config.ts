import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  prefix: process.env.API_PREFIX || 'api',
  version: process.env.API_VERSION || 'v1',
  nodeEnv: process.env.NODE_ENV || 'development',
}));
