import { registerAs } from '@nestjs/config';

/**
 * This file registers environment variables
 */

export default registerAs('personal_db', () => {
  // const pgUser = process.env.DB_EPRO_VENDOR_USERNAME;
  const config = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  };

  console.debug(config);
  const dbInfo = { ...config };
  delete dbInfo.password;

  return config;
});
