import { Injectable } from '@nestjs/common';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

import { GetPostListReq } from './Dto/get.post.list.dto';
import { GetPostListInterface } from './Interface/get.post.list.interface';

@Injectable()
export class PostsRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得文章列表
   * @param code
   * @returns
   */
  async getPostList(req: GetPostListReq): Promise<GetPostListInterface[]> {
    const _start = this.internalConn.escape((req?.page - 1) * req?.perPage);
    const _limit = this.internalConn.escape(req?.perPage);

    const sqlStr = `
      SELECT 
        bp.Post_ID AS id, 
        bp.Post_Name AS title, 
        bp.Create_Date AS createdDate, 
        bp.Short_Content AS shortContent
      FROM blog_post bp 
      ORDER BY bp.Create_Date DESC
      LIMIT ${_start}, ${_limit}
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 計算文章總數
   * @returns
   */
  async getPostListCount(): Promise<number> {
    const sqlStr = `
      SELECT 
        COUNT(bp.Post_ID) AS count
      FROM blog_post bp 
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result?.[0]?.count;
  }
}
