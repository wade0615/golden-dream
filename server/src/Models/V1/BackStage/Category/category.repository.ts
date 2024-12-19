import { Injectable } from '@nestjs/common';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

import { GetCategoryOptionsInterface } from './InterFace/get.category.options.interface';

@Injectable()
export class CategoryRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得分類下拉選單列表
   * @param code
   * @returns
   */
  async getBackStageCategoryOptions(): Promise<GetCategoryOptionsInterface[]> {
    const sqlStr = `
      SELECT 
        bc.Category_ID AS categoryId,
        bc.Category_Name AS categoryName
      FROM blog_category bc
    `;

    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result;
  }
}
