import { Module } from '@nestjs/common';
import { CommonModule } from 'src/Models/V1/Common/common.module';
import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';
import { RedisModule } from 'src/Providers/Database/Redis/redis.module';
import { ConvertExcel } from 'src/Utils/DataFrame/excel';
import { ConvertZip } from 'src/Utils/DataFrame/zip';
import { BrandRepository } from '../Brand/brand.repository';
import { CommonService } from '../Common/common.service';
import { MemberRepository } from '../Member/member.repository';
import { MemberShipModule } from '../MemberShip/memberShip.module';
import { PaymentRepository } from '../Payment/payment.repository';
import { PermissionRepository } from '../Permission/permission.repository';
import { StoreRepository } from '../Store/store.repository';
import { TagRepository } from '../Tag/tag.repository';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [MysqlModule, CommonModule, RedisModule, MemberShipModule],
  controllers: [OrderController],
  providers: [
    CommonService,
    OrderService,
    OrderRepository,
    MemberRepository,
    BrandRepository,
    StoreRepository,
    PaymentRepository,
    PermissionRepository,
    TagRepository,
    ConvertExcel,
    ConvertZip
  ]
})
export class OrderModule {}
