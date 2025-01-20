import { Injectable } from '@nestjs/common';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

import { GetPostListReq } from './Dto/get.post.list.dto';
import { AddPostInterface } from './Interface/add.post.interface';
import { EditPostInterface } from './Interface/edit.post.interface';
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
        bp.Alter_Date AS alterDate,
        bp.Short_Content AS shortContent,
        bc.Category_Name AS categoryName
      FROM blog_post bp 
      LEFT JOIN blog_map_post_category bmpc 
        ON bmpc.Post_ID = bp.Post_ID
      LEFT JOIN blog_category bc 
        ON bc.Category_ID = bmpc.Category_ID 
      WHERE bp.Post_Type = 2
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
        bp.Short_Content AS shortContent,
        bc.Category_ID AS categoryId,
        bc.Category_Name AS categoryName
      FROM blog_post bp 
      LEFT JOIN blog_map_post_category bmpc 
        ON bmpc.Post_ID = bp.Post_ID
      LEFT JOIN blog_category bc 
        ON bc.Category_ID = bmpc.Category_ID 
      WHERE bp.Post_ID = ${_postId}
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

  /**
   * 新增文章
   * @returns
   */
  async postBackStageAddPost(postData: AddPostInterface): Promise<any> {
    const _postId = this.internalConn.escape(postData?.postId);
    const _postName = this.internalConn.escape(postData?.postName);
    const _createId = this.internalConn.escape(postData?.createId);
    const _alterId = this.internalConn.escape(postData?.alterId);
    const _content = this.internalConn.escape(postData?.content);
    const _shortContent = this.internalConn.escape(postData?.shortContent);
    const _postType = this.internalConn.escape(postData?.postType);
    const _isPublish = this.internalConn.escape(postData?.isPublish);

    const sqlStr = `
      INSERT INTO blog_post 
        (
          Post_ID, Post_Name, Create_ID, Alter_ID, 
          Content, Short_Content, 
          Post_Type, Is_Publish, Is_Active)
      VALUES
        (
          ${_postId}, ${_postName}, ${_createId}, ${_alterId},
          ${_content}, ${_shortContent},
          ${_postType}, ${_isPublish}, 1
        );
    `;

    await this.internalConn.query(sqlStr, []);

    return true;
  }

  /** 關聯文章&分類 */
  async mappingPostCategory(postId: string, category: string): Promise<any> {
    const _postId = this.internalConn.escape(postId);
    const _category = this.internalConn.escape(category);

    const sqlStr = `
      INSERT INTO blog_map_post_category 
        (Post_ID, Category_ID)
      VALUES
        (${_postId}, ${_category});
    `;

    await this.internalConn.query(sqlStr, []);

    return true;
  }

  /** 編輯文章 */
  async editPost(connection, postData: EditPostInterface): Promise<any> {
    const _postId = this.internalConn.escape(postData?.postId);
    const _postName = this.internalConn.escape(postData?.postName);
    const _alterId = this.internalConn.escape(postData?.alterId);
    const _content = this.internalConn.escape(postData?.content);
    const _shortContent = this.internalConn.escape(postData?.shortContent);
    const _postType = this.internalConn.escape(postData?.postType);
    const _isPublish = this.internalConn.escape(postData?.isPublish);

    const sqlStr = `
      UPDATE blog_post 
      SET 
        Post_Name = ${_postName},
        Alter_ID = ${_alterId},
        Content = ${_content},
        Short_Content = ${_shortContent},
        Post_Type = ${_postType},
        Is_Publish = ${_isPublish}
      WHERE Post_ID = ${_postId};
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, []);

    return true;
  }

  async updatePostCategory(
    connection,
    req: { postId: string; category: string }
  ): Promise<any> {
    const _postId = this.internalConn.escape(req?.postId);
    const _category = this.internalConn.escape(req?.category);

    const sqlStr = `
      UPDATE blog_map_post_category 
      SET 
        Category_ID = ${_category}
      WHERE Post_ID = ${_postId};
    `;

    await this.internalConn.transactionQuery(connection, sqlStr, []);

    return true;
  }
}
