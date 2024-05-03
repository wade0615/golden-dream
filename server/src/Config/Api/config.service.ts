import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with api config based operations.
 *
 * @class
 */
@Injectable()
export class ConfigApiService {
  constructor(private configService: ConfigService) {}

  get timeout(): number {
    return this.configService.get<number>('api.timeout');
  }

  get adminIds(): string[] {
    return this.configService.get<string>('api.adminIds')?.split(',') || [];
  }

  get adminPwd(): string {
    return this.configService.get<string>('api.adminPwd');
  }

  get jwtAccessTokenSecret(): string {
    return this.configService.get<string>('api.jwtAccessTokenSecret');
  }

  get jwtAccessTokenExpirationTime(): number {
    return this.configService.get<number>('api.jwtAccessTokenExpirationTime');
  }

  get jwtRefreshTokenSecret(): string {
    return this.configService.get<string>('api.jwtRefreshTokenSecret');
  }

  get jwtRefreshTokenExpirationTime(): number {
    return this.configService.get<number>('api.jwtRefreshTokenExpirationTime');
  }

  get publicApiKey(): string {
    return this.configService.get<string>('api.publicApiKey');
  }

  get oAuthPublicKey(): string {
    return this.configService.get<string>('api.oAuthPublicKey');
  }

  get backstageChannelCertificate(): string {
    return this.configService.get<string>('api.backstageChannelCertificate');
  }

  get oauthUrl(): string {
    return this.configService.get<string>('api.oauthUrl');
  }
}
