import { Injectable } from '@nestjs/common';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

@Injectable()
export class PostsRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得文章列表
   * @param code
   * @returns
   */
  async getPostList(req): Promise<any> {
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
}
