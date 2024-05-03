import { HttpStatus, Injectable } from '@nestjs/common';
import configError from 'src/Config/error.message.config';

import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { GetPaymentListDto } from './Dto';
import { PaymentRepository } from './payment.repository';

import { PaymentEntity } from './Entity/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得付款方式列表
   * @param req
   * @returns
   */
  async getPaymentList(): Promise<GetPaymentListDto> {
    // 取得付款方式清單，排除刪除狀態
    const result = await this.paymentRepository.getPaymentList();
    // 回傳結果
    return result;
  }

  /**
   * 單筆新增付款方式
   * @param body
   * @returns
   */
  async addPayment(body): Promise<any> {
    const paymentName = body.paymentName;
    const paymentId = body.paymentId;

    // 檢查名稱是否過長
    if (paymentName.length > 12) {
      throw new CustomerException(configError._300003, HttpStatus.OK);
    }
    // 檢查代碼是否過長
    if (paymentId.length > 6) {
      throw new CustomerException(configError._300004, HttpStatus.OK);
    }

    const paymentList = await this.paymentRepository.getPaymentList();

    // 確認付款方式付款方式名稱是否重複
    if (paymentList.find((x) => x.paymentName === paymentName)) {
      throw new CustomerException(configError._300001, HttpStatus.OK);
    }
    // 確認付款方式代碼是否重複
    if (paymentList.find((x) => x.paymentId === paymentId)) {
      throw new CustomerException(configError._300002, HttpStatus.OK);
    }

    const insertEntity = new PaymentEntity(body).insertEntity();
    await this.paymentRepository.addPayment(insertEntity);
    return {};
  }

  /**
   * 修改付款方式資料
   * @param req
   * @returns
   */
  async updatePayment(body): Promise<Record<string, never>> {
    const id = body.id;
    const paymentName = body.paymentName;
    const paymentId = body.paymentId;

    // 檢查名稱是否過長
    if (paymentName.length > 12) {
      throw new CustomerException(configError._300003, HttpStatus.OK);
    }
    // 檢查代碼是否過長
    if (paymentId.length > 6) {
      throw new CustomerException(configError._300004, HttpStatus.OK);
    }

    const paymentList = await this.paymentRepository.getPaymentList();

    // 確認付款方式名稱是否重複
    if (paymentList.find((x) => x.paymentName === paymentName && x.id !== id)) {
      throw new CustomerException(configError._300001, HttpStatus.OK);
    }
    // 確認付款方式代碼是否重複
    if (paymentList.find((x) => x.paymentId === paymentId && x.id !== id)) {
      throw new CustomerException(configError._300002, HttpStatus.OK);
    }

    const updateEntity = new PaymentEntity(body).updateEntity();
    await this.paymentRepository.updatePayment(id, updateEntity);

    return {};
  }

  /**
   * 刪除付款方式資料（軟刪除）
   * @param req
   * @returns
   */
  async deletePayment(body): Promise<Record<string, never>> {
    const id = body.id;
    const set = {
      Is_Active: 0,
      Alter_ID: body.iam.authMemberId
    };
    await this.paymentRepository.updatePayment(id, set);

    return {};
  }

  /**
   * 調整付款方式排序
   * @param req
   * @returns
   */
  async updatePaymentSort(body): Promise<Record<string, never>> {
    if (body?.listSorts.length == 0) {
      throw new CustomerException(configError._200007, HttpStatus.OK);
    }

    const paymentList = await this.paymentRepository.getPaymentList();

    // 判斷修改排序的數量是否為全部
    if (paymentList?.length != body?.listSorts.length) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      let rank = 0;
      for (const brandId of body?.listSorts) {
        const set = {
          Sort_Order: rank,
          Alter_ID: body.iam.authMemberId
        };

        await this.paymentRepository.updPaymentSort(connection, brandId, set);
        rank++;
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._200002, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }
}
