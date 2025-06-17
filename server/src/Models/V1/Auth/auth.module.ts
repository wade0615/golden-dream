import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfigApiModule } from 'src/Config/Api/config.module';
import { ConfigApiService } from 'src/Config/Api/config.service';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
// import { RedisModule } from 'src/Providers/Database/Redis/redis.module';

@Module({
  imports: [
    MysqlModule,
    ConfigApiModule,
    JwtModule.registerAsync({
      imports: [ConfigApiModule],
      useFactory: (configApiService: ConfigApiService) => ({
        secret: configApiService.jwtAccessTokenSecret,
        signOptions: {
          expiresIn: configApiService.jwtAccessTokenExpirationTime
        }
      }),
      inject: [ConfigApiService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [AuthService]
})
export class AuthModule {}
