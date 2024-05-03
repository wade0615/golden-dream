import { Injectable } from '@nestjs/common';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';

@Injectable()
export class MealPeriodRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得餐期列表清單
   * @returns
   */
  async getPOSMealPeriosList(): Promise<any> {
    let sqlStr = `
    SELECT
      ID as id,
      Meal_Period_ID as mealPeriodId,
      Meal_Period_Name as mealPeriodName,
      Create_Date as createDate,
      Alter_Date as alterDate,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = POS_Meal_Period_Setting.Create_ID), 'system') as createName,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = POS_Meal_Period_Setting.Alter_ID), 'system') as alterName
    FROM POS_Meal_Period_Setting
    WHERE Is_Active = 1
    ORDER BY Sort_Order, Create_Date DESC
    `;
    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result ?? [];
  }

  /**
   * 新增餐期
   * @returns
   */
  async addMealPeriod(set): Promise<any[]> {
    let sqlStr = `INSERT INTO POS_Meal_Period_Setting SET ?`;

    await this.internalConn.query(sqlStr, [set]);
    return;
  }

  /**
   * 更新餐期
   * @returns
   */
  async updateMealPeriod(id, set): Promise<any[]> {
    let sqlStr = `UPDATE POS_Meal_Period_Setting SET ? WHERE ID = ?`;

    await this.internalConn.query(sqlStr, [set, id]);
    return;
  }

  async updMealPeriodRank(
    connection,
    brandId: string,
    set: object
  ): Promise<Record<string, never>> {
    const sqlStr = `UPDATE POS_Meal_Period_Setting SET ? WHERE ID = ?`;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      set,
      brandId
    ]);

    return {};
  }
}
