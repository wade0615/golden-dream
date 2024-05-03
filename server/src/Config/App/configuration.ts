import { registerAs } from '@nestjs/config';

/**
 * This file registers environment variables
 */

export default registerAs('app', () => ({
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  domain: process.env.APP_DOMAIN,
  port: process.env.APP_PORT,
  redisHost: process.env.APP_REDIS_HOST,
  redisPort: process.env.APP_REDIS_PORT,
  redisPassword: process.env.APP_REDIS_PASSWORD,
  redisDb: process.env.APP_REDIS_DB,
  keepAliveTimeout: 1000 * 60 * 5,
  headersTimeout: 1000 * 65 * 5,
}));
