import { registerAs } from '@nestjs/config';

/**
 * This file registers environment variables
 */

export default registerAs('redis', () => {
  const config = {
    host: process.env.APP_REDIS_HOST,
    port: process.env.APP_REDIS_PORT,
    password: process.env.APP_REDIS_PASSWORD
  };

  console.debug(config);
  const dbInfo = { ...config };
  delete dbInfo.password;

  return config;
});
