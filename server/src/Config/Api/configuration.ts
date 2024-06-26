import { registerAs } from '@nestjs/config';

/**
 * This file registers environment variables
 */

export default registerAs('api', () => ({
  timeout: 60000,
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtAccessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwtRefreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  oAuthPublicKey: process.env.CRM_PUBLIC_KEY,
  backstageChannelCertificate: process.env.BACKSTAGE_CHANNEL_CERTIFICATE,
  oauthUrl: process.env.OAUTH_URL
}));
