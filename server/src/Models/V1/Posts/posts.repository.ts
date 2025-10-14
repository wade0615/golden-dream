import { Injectable } from '@nestjs/common';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

import { GetPostListReq } from './Dto/get.post.list.dto';
import { GetPostByIdInterface } from './Interface/get.post.by.id.interface';
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
        bp.Short_Content AS shortContent,
        bc.Category_Name AS categoryName
      FROM blog_post bp 
      LEFT JOIN blog_map_post_category bmpc 
        ON bmpc.Post_ID = bp.Post_ID
      LEFT JOIN blog_category bc 
        ON bc.Category_ID = bmpc.Category_ID 
      WHERE bp.Post_Type = 2
        AND bp.Is_Active = 1
        AND bp.Is_Publish = 1
        AND bp.Is_Public = 1
      ORDER BY bp.Seq DESC
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
      WHERE bp.Post_Type = 2
        AND bp.Is_Active = 1
        AND bp.Is_Publish = 1
        AND bp.Is_Public = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result?.[0]?.count;
  }

  /**
   * 取得指定文章
   * @param postId
   * @returns
   */
  async getPostById(postId: string): Promise<GetPostByIdInterface> {
    const _postId = this.internalConn.escape(postId);

    const sqlStr = `
      SELECT 
        bp.Post_ID AS id, 
        bp.Post_Name AS title, 
        bp.Create_Date AS createdDate, 
        bp.Content AS content,
        bc.Category_Name AS categoryName,
        bc.Category_ID AS categoryId
      FROM blog_post bp 
      LEFT JOIN blog_map_post_category bmpc 
        ON bmpc.Post_ID = bp.Post_ID
      LEFT JOIN blog_category bc 
        ON bc.Category_ID = bmpc.Category_ID 
      WHERE bp.Post_ID = ${_postId}
        AND bp.Is_Active = 1
        AND bp.Is_Publish = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result?.[0];
  }

  /**
   * 取得前一篇文章與後一篇文章的ID
   * @returns
   */
  async getPostPrevAndNextId(
    postId: string
  ): Promise<{ prevId: string; nextId: string }> {
    const _postId = this.internalConn.escape(postId);

    const sqlStr = `
      -- 前一個 Seq 的 Post_ID
      SELECT 
          bp.Post_ID AS prevPostId 
      FROM blog_post bp
      WHERE bp.Seq < (
          SELECT Seq
          FROM blog_post
          WHERE Post_ID = ${_postId} AND Post_Type = 2
      )
      AND Post_Type = 2
      ORDER BY bp.Seq DESC
      LIMIT 1;

      -- 後一個 Seq 的 Post_ID
      SELECT 
          bp.Post_ID AS nextPostId 
      FROM blog_post bp
      WHERE bp.Seq > (
          SELECT Seq
          FROM blog_post
          WHERE Post_ID = ${_postId} AND Post_Type = 2
      )
      AND Post_Type = 2
      ORDER BY bp.Seq ASC
      LIMIT 1;
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    const prevId = result?.[0]?.[0]?.prevPostId;
    const nextId = result?.[1]?.[0]?.nextPostId;

    return { prevId, nextId };
  }
}
