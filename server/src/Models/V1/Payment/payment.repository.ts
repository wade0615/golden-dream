import { Injectable } from '@nestjs/common';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { GetPaymentDetailResp } from './Interface/get.payment.detail.interface';

@Injectable()
export class PaymentRepository {
  constructor(private internalConn: MysqlProvider) {}

  /**
   * 取得餐期列表清單
   * @returns
   */
  async getPaymentList(): Promise<any> {
    let sqlStr = `
    SELECT
      payment.ID as id,
      payment.Payment_ID as paymentId,
      payment.Payment_Name as paymentName,
      payment.Create_Date as createDate,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = payment.Create_ID), 'system') as createName,
      payment.Alter_Date as alterDate,
      IFNULL((SELECT Auth_Name FROM Auth_Member WHERE Auth_Member_ID = payment.Alter_ID), 'system') as alterName
    FROM
      Payment_Setting payment
    WHERE payment.Is_Active = 1
    ORDER BY payment.Sort_Order, payment.Create_Date DESC
    `;
    const result = (await this.internalConn.query(sqlStr, [])) ?? [];

    return result ?? [];
  }

  /**
   * 新增餐期
   * @returns
   */
  async addPayment(set): Promise<any[]> {
    let sqlStr = `INSERT INTO Payment_Setting SET ?`;

    await this.internalConn.query(sqlStr, [set]);
    return;
  }

  /**
   * 更新餐期
   * @returns
   */
  async updatePayment(id, set): Promise<any[]> {
    let sqlStr = `UPDATE Payment_Setting SET ? WHERE ID = ?`;

    await this.internalConn.query(sqlStr, [set, id]);
    return;
  }

  async updPaymentSort(
    connection,
    brandId: string,
    set: object
  ): Promise<Record<string, never>> {
    const sqlStr = `UPDATE Payment_Setting SET ? WHERE ID = ?`;

    await this.internalConn.transactionQuery(connection, sqlStr, [
      set,
      brandId
    ]);

    return {};
  }

  /**
   * 取得支付詳細資料
   *
   * @param paymentSeq
   * @returns
   */
  async getPaymentDetail(paymentSeq: number): Promise<GetPaymentDetailResp> {
    const sqlStr = `
    SELECT
      Payment_ID as paymentId,
      Payment_Name as paymentName
    FROM
      Payment_Setting
    WHERE Is_Active = 1
      AND ID = ?
    `;

    const result = (await this.internalConn.query(sqlStr, [paymentSeq])) ?? [];

    return result?.[0];
  }
}
