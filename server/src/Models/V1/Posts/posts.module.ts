import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

import { MysqlModule } from 'src/Providers/Database/DatabaseMysql/mysql.module';

@Module({
  imports: [MysqlModule],
  controllers: [PostsController],
  providers: [PostsRepository, PostsService]
})
export class PostsModule {}
