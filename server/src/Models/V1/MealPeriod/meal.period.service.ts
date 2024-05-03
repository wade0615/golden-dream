import { HttpStatus, Injectable } from '@nestjs/common';
import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { GetMealPeriodListDto, UpdMealPeriodDto } from './Dto';
import { MealPeriodEntity } from './Entity/pos.meal.period.setting';
import { MealPeriodRepository } from './meal.period.repository';

@Injectable()
export class MealPeriodService {
  constructor(
    private mealPeriodRepository: MealPeriodRepository,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得餐期列表
   * @param req
   * @returns
   */
  async getPOSMealPeriodList(): Promise<GetMealPeriodListDto[]> {
    // 取得餐期清單，排除刪除狀態
    const result = await this.mealPeriodRepository.getPOSMealPeriosList();
    // 回傳結果
    return result;
  }

  /**
   * 單筆新增餐期
   * @param req
   * @returns
   */
  async addPOSMealPeriod(req): Promise<any> {
    const mealPeriodName = req.mealPeriodName;
    const mealPeriodId = req.mealPeriodId;

    // 檢查名稱是否過長
    if (mealPeriodName.length > 6) {
      throw new CustomerException(configError._290003, HttpStatus.OK);
    }
    // 檢查代碼是否過長
    if (mealPeriodId.length > 4) {
      throw new CustomerException(configError._290004, HttpStatus.OK);
    }

    const mealPeriodList =
      await this.mealPeriodRepository.getPOSMealPeriosList();

    // 確認餐期餐期名稱是否重複
    if (mealPeriodList.find((x) => x.mealPeriodName === mealPeriodName)) {
      throw new CustomerException(configError._290001, HttpStatus.OK);
    }
    // 確認餐期代碼是否重複
    if (mealPeriodList.find((x) => x.mealPeriodId === mealPeriodId)) {
      throw new CustomerException(configError._290002, HttpStatus.OK);
    }

    // 新增餐期
    const insertSet = new MealPeriodEntity(req).insertEntity();

    await this.mealPeriodRepository.addMealPeriod(insertSet);
    return {};
  }

  /**
   * 修改餐期資料
   * @param req
   * @returns
   */
  async updatePOSMealPeriod(
    body: UpdMealPeriodDto
  ): Promise<Record<string, never>> {
    const id = body.id;
    const mealPeriodName = body.mealPeriodName;
    const mealPeriodId = body.mealPeriodId;

    // 檢查名稱是否過長
    if (mealPeriodName.length > 6) {
      throw new CustomerException(configError._290003, HttpStatus.OK);
    }
    // 檢查代碼是否過長
    if (mealPeriodId.length > 4) {
      throw new CustomerException(configError._290004, HttpStatus.OK);
    }

    const mealPeriodList =
      await this.mealPeriodRepository.getPOSMealPeriosList();

    // 確認餐期餐期名稱是否重複
    if (
      mealPeriodList.find(
        (x) => x.mealPeriodName === mealPeriodName && x.id !== id
      )
    ) {
      throw new CustomerException(configError._290001, HttpStatus.OK);
    }
    // 確認餐期代碼是否重複
    if (
      mealPeriodList.find((x) => x.mealPeriodId === mealPeriodId && x.id !== id)
    ) {
      throw new CustomerException(configError._290002, HttpStatus.OK);
    }

    const updateSet = new MealPeriodEntity(body).updateEntity();

    await this.mealPeriodRepository.updateMealPeriod(id, updateSet);

    return {};
  }

  /**
   * 刪除餐期資料（軟刪除）
   * @param req
   * @returns
   */
  async deletePOSMealPeriod(body): Promise<Record<string, never>> {
    const id = body.id;
    const set = {
      Is_Active: 0,
      Alter_ID: body?.iam?.authMemberId ?? 'System'
    };
    await this.mealPeriodRepository.updateMealPeriod(id, set);

    return {};
  }

  /**
   * 調整餐期排序
   * @param req
   * @returns
   */
  async updatePOSort(body): Promise<Record<string, never>> {
    // 無異動
    if (body?.listSorts?.length == 0) {
      throw new CustomerException(configError._200007, HttpStatus.OK);
    }

    const mealPeriodList =
      await this.mealPeriodRepository.getPOSMealPeriosList();

    // 判斷修改排序的數量是否為全部
    if (mealPeriodList?.length != body?.listSorts?.length) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 批量修改順序
      let rank = 0;
      for (const id of body?.listSorts) {
        const set = {
          Sort_Order: rank,
          Alter_ID: body?.iam?.authMemberId ?? 'System'
        };
        await this.mealPeriodRepository.updMealPeriodRank(connection, id, set);
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
