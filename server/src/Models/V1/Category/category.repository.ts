import { Injectable } from '@nestjs/common';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

import { GetCategoryPostListReq } from './Dto/get.category.post.list.dto';

import { GetCategoryListInterface } from './InterFace/get.category.list.interface';
import { GetCategoryPostListInterface } from './Interface/get.category.post.list.interface';

@Injectable()
export class CategoryRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得分類下拉選單列表
   * @param code
   * @returns
   */
  async getCategoryList(): Promise<GetCategoryListInterface[]> {
    const sqlStr = `
      SELECT 
        bc.Category_ID AS categoryId,
        bc.Category_Name AS categoryName
      FROM blog_category bc
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 取得分類文章列表
   * @param code
   * @returns
   */
  async getCategoryPostList(
    req: GetCategoryPostListReq
  ): Promise<GetCategoryPostListInterface[]> {
    const _categoryId = this.internalConn.escape(req?.categoryId);
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
      WHERE bc.Category_ID = ${_categoryId}
        AND bp.Post_Type = 2
        AND bp.Is_Active = 1
        AND bp.Is_Publish = 1
      ORDER BY bp.Seq DESC
      LIMIT ${_start}, ${_limit};
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }

  /**
   * 計算文章總數
   * @returns
   */
  async getCategoryPostListCount(categoryId): Promise<number> {
    const _categoryId = this.internalConn.escape(categoryId);

    const sqlStr = `
      SELECT 
        COUNT(bp.Post_ID) AS count
      FROM blog_post bp 
      LEFT JOIN blog_map_post_category bmpc 
        ON bmpc.Post_ID = bp.Post_ID
      LEFT JOIN blog_category bc 
        ON bc.Category_ID = bmpc.Category_ID  
      WHERE bc.Category_ID = ${_categoryId}
        AND bp.Post_Type = 2
        AND bp.Is_Active = 1
        AND bp.Is_Publish = 1
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result?.[0]?.count;
  }
}
