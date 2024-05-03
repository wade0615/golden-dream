import { registerAs } from '@nestjs/config';

/**
 * This file registers environment variables
 */

export default registerAs('kafka', () => {
  const config = {
    host: process.env.APP_KAFKA_HOST,
    port: process.env.APP_KAFKA_PORT,
    userName: process.env.APP_KAFKA_USERNAME,
    password: process.env.APP_KAFKA_PASSWORD
  };

  console.debug(config);
  const dbInfo = { ...config };
  delete dbInfo.password;

  return config;
});
