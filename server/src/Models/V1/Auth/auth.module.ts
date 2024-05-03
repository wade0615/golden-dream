import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { ConfigApiModule } from '../../../Config/Api/config.module';
import { ConfigApiService } from '../../../Config/Api/config.service';
import { MysqlModule } from '../../../Providers/Database/DatabaseMysql/mysql.module';
import { ChannelRepository } from '../Channel/channel.repository';
import { CouponRepository } from '../Coupon/coupon.repository';
import { MemberShipRepository } from '../MemberShip/memberShip.repository';
import { MemberShipService } from '../MemberShip/memberShip.service';
import { PermissionModule } from '../Permission/permission.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MysqlModule,
    RedisModule,
    ConfigApiModule,
    forwardRef(() => PermissionModule),
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
  providers: [
    AuthService,
    AuthRepository,
    MemberShipService,
    MemberShipRepository,
    CouponRepository,
    ChannelRepository
  ],
  exports: [AuthService]
})
export class AuthModule {}
