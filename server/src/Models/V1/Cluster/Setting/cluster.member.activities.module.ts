import { HttpStatus } from '@nestjs/common';
import configError from 'src/Config/error.message.config';
import { CLUSTER_MEMBER_SETTING_TYPE } from 'src/Definition/Enum/Cluster/cluster.member.type.enum';
import {
  CLUSTER_SETTING_CONDITIONAL_TYPE,
  CLUSTER_SETTING_MAIN_TYPE
} from 'src/Definition/Enum/Cluster/cluster.setting.type.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { getLogTableNameByMonth } from 'src/Utils/tools';
import { v4 as ruuidv4 } from 'uuid';
import { ClusterTempData } from '../Interface/cluster.temp.data.interface';
import { GetClusterManagementData } from '../Interface/get.cluster.data.interface';
import { ClusterSettingModule } from './cluster.setting.module';

/**
 * 分群設定 - 會員活動 與 消費統計
 */
export class MemberActivitiesClusterModule extends ClusterSettingModule {
  /**
   * 處理分群
   *
   * @param setting
   * @param exclude
   * @param startDate
   * @param endDate
   * @param clusterTempData
   * @returns
   */
  public async handleCluster(
    setting,
    exclude: string,
    startDate: string,
    endDate: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    for (const data of setting) {
      const tempClusterTable = `Temp_Cluster_${ruuidv4().replace(/-/g, '_')}`;

      switch (data?.type) {
        case CLUSTER_SETTING_MAIN_TYPE.MEMBER_SHIP:
        case CLUSTER_SETTING_MAIN_TYPE.MEMBER_SHIP_UPGRADE_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.MEMBER_SHIP_EXPIRED_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.UPGRADE_DIFF_AMOUNT:
        case CLUSTER_SETTING_MAIN_TYPE.UPGRADE_DIFF_COUNT:
          clusterTempData =
            await this.clusterRepository.setMemberShipClusterSql(
              tempClusterTable,
              data,
              exclude,
              clusterTempData
            );

          break;
        case CLUSTER_SETTING_MAIN_TYPE.LAST_POINT:
        case CLUSTER_SETTING_MAIN_TYPE.POINT_EXPIRED_DATE:
          clusterTempData =
            await this.clusterRepository.setMemberPointClusterSql(
              tempClusterTable,
              data,
              exclude,
              clusterTempData
            );

          break;
        case CLUSTER_SETTING_MAIN_TYPE.POINT_ACTIVITY:
        case CLUSTER_SETTING_MAIN_TYPE.USED_POINT:
        case CLUSTER_SETTING_MAIN_TYPE.USED_POINT_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.POINT_USE:
          const preName = 'Member_Point_Log_';
          let logTable = getLogTableNameByMonth(preName, startDate, endDate);
          logTable = await this.commonService.getExistedTable(logTable);

          if (logTable?.length == 0) {
            continue;
          }

          clusterTempData =
            await this.clusterRepository.setMemberPointLogClusterSql(
              tempClusterTable,
              data,
              exclude,
              logTable,
              clusterTempData
            );
          break;
        case CLUSTER_SETTING_MAIN_TYPE.MAIN_MEMBER:
        case CLUSTER_SETTING_MAIN_TYPE.DROWSY_MEMBER:
        case CLUSTER_SETTING_MAIN_TYPE.SLEEPY_MEMBER:
        case CLUSTER_SETTING_MAIN_TYPE.LOST_MEMBER:
          const clusterCommon =
            await this.clusterRepository.getClusterCommonSetting();
          const clusterCommonData = <GetClusterManagementData>{};
          clusterCommon?.forEach((common) => {
            if (
              common.membersType == CLUSTER_MEMBER_SETTING_TYPE[setting?.type]
            ) {
              clusterCommonData.memberType = common.membersType;
              clusterCommonData.consumer = common.consumer;
              clusterCommonData.notConsumer = common.notConsumer;
            }
          });

          clusterTempData =
            await this.clusterRepository.setMemberManagementClusterSql(
              tempClusterTable,
              clusterCommonData,
              exclude,
              clusterTempData
            );

          break;
        case CLUSTER_SETTING_MAIN_TYPE.MEMBER_SIGN_IN:
        case CLUSTER_SETTING_MAIN_TYPE.SIGN_IN_CHANNEL:
          clusterTempData = await this.clusterRepository.setMemberLogClusterSql(
            tempClusterTable,
            data,
            exclude,
            clusterTempData
          );
          break;
        case CLUSTER_SETTING_MAIN_TYPE.REFERRER_PEOPLE:
          clusterTempData =
            await this.clusterRepository.setMemberReferrerClusterSql(
              tempClusterTable,
              data,
              exclude,
              clusterTempData
            );
          break;
        case CLUSTER_SETTING_MAIN_TYPE.MEMBER_TAG:
        case CLUSTER_SETTING_MAIN_TYPE.USE_TAG_DATE:
          clusterTempData = await this.clusterRepository.setMemberTagClusterSql(
            tempClusterTable,
            data,
            exclude,
            clusterTempData
          );

          break;
        case CLUSTER_SETTING_MAIN_TYPE.BOOKING_BRAND:
        case CLUSTER_SETTING_MAIN_TYPE.BOOKING_STORE:
        case CLUSTER_SETTING_MAIN_TYPE.BOOKING_PEOPLE:
        case CLUSTER_SETTING_MAIN_TYPE.BOOKING_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.NOT_CHECK_IN_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.MEAL_DATE:
          clusterTempData =
            await this.clusterRepository.setBookingDetailClusterSql(
              tempClusterTable,
              data,
              exclude,
              clusterTempData
            );
          break;
        case CLUSTER_SETTING_MAIN_TYPE.RECEIVED_DISCOUNT_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.VALID_DISCOUNT_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_EXPIRATION_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_DISCOUNT_COUPON:
        case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_DISCOUNT_COUPON_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_DISCOUNT_COUPON_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.COMMODITY_COUPON:
        case CLUSTER_SETTING_MAIN_TYPE.COMMODITY_COUPON_EXPIRED_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_COMMODITY_COUPON:
        case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_STORE:
        case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_COMMODITY_COUPON_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.NOT_WRITE_OFF_COMMODITY_COUPON:
        case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_WRITE_OFF:
        case CLUSTER_SETTING_MAIN_TYPE.COMMODITY_WRITE_OFF:
          clusterTempData =
            await this.clusterRepository.setMemberCouponClusterSql(
              tempClusterTable,
              data,
              exclude,
              clusterTempData
            );

          break;
        case CLUSTER_SETTING_MAIN_TYPE.REWARD_CARD:
        case CLUSTER_SETTING_MAIN_TYPE.REWARD_CARD_DIFF_POINT:
          clusterTempData =
            await this.clusterRepository.setRewardBalanceClusterSql(
              tempClusterTable,
              data,
              exclude,
              clusterTempData
            );
          break;
        case CLUSTER_SETTING_MAIN_TYPE.RECEIVED_REWARD_CARD:
        case CLUSTER_SETTING_MAIN_TYPE.RECEIVED_REWARD_CARD_POINT:
        case CLUSTER_SETTING_MAIN_TYPE.REDEEMED_REWARD_CARD_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.REWARD_CARD_REDEEM:
          clusterTempData =
            await this.clusterRepository.setRewardDetailClusterSql(
              tempClusterTable,
              data,
              exclude,
              clusterTempData
            );

          break;
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_CHANNEL:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_BRAND:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_STORE:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_PEOPLE:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_MEAL_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_COMMODITY:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_ORIGINAL_AMOUNT:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_PAID_AMOUNT:
        case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_AMOUNT:
        case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_POINT_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_POINT:
        case CLUSTER_SETTING_MAIN_TYPE.DELIVERY:
        case CLUSTER_SETTING_MAIN_TYPE.PAYMENT:
          clusterTempData =
            await this.clusterRepository.setMemberOrderClusterSql(
              tempClusterTable,
              data,
              exclude,
              clusterTempData
            );
          break;
        case CLUSTER_SETTING_MAIN_TYPE.CANCEL_RETURN_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.CANCEL_RETURN_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.CANCEL_RETURN_AMOUNT:
          clusterTempData =
            await this.clusterRepository.setMemberOrderReturnClusterSql(
              tempClusterTable,
              data,
              exclude,
              clusterTempData
            );
          break;
      }

      if (data?.conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.AND) {
        clusterTempData.positiveTempTables = [tempClusterTable];
      } else {
        clusterTempData.positiveTempTables.push(tempClusterTable);
      }

      if (
        !clusterTempData?.tempClusterDetailJoinTables.includes(tempClusterTable)
      ) {
        clusterTempData?.tempClusterDetailJoinTables.push(tempClusterTable);
      }
    }

    return clusterTempData;
  }

  /**
   * 檢查分群設定
   *
   * @param clusterSetting
   */
  public async chkClusterSetting(clusterSetting) {
    for (const setting of clusterSetting) {
      switch (setting?.type) {
        case CLUSTER_SETTING_MAIN_TYPE.MEMBER_SHIP:
        case CLUSTER_SETTING_MAIN_TYPE.SIGN_IN_CHANNEL:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_CHANNEL:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_COMMODITY:
        case CLUSTER_SETTING_MAIN_TYPE.BOOKING_STORE:
        case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_STORE:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_STORE:
          if (!setting?.data?.ids?.length) {
            // 空值
            throw new CustomerException(configError._400005, HttpStatus.OK);
          }
          break;
        case CLUSTER_SETTING_MAIN_TYPE.MEMBER_SHIP_UPGRADE_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.MEMBER_SHIP_EXPIRED_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.POINT_EXPIRED_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.USED_POINT_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.USE_TAG_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.MEAL_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_EXPIRATION_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_DISCOUNT_COUPON_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.COMMODITY_COUPON_EXPIRED_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_COMMODITY_COUPON_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.REDEEMED_REWARD_CARD_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.CANCEL_RETURN_DATE:
          const conditionalByDate = [
            'greater',
            'greaterEqual',
            'less',
            'lessEqual',
            'equal',
            'SPECIFY',
            'EXPORT'
          ];
          if (!conditionalByDate.includes(setting?.data?.conditional)) {
            // 條件不符合
            throw new CustomerException(configError._400004, HttpStatus.OK);
          }
          break;
        case CLUSTER_SETTING_MAIN_TYPE.UPGRADE_DIFF_AMOUNT:
        case CLUSTER_SETTING_MAIN_TYPE.UPGRADE_DIFF_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.LAST_POINT:
        case CLUSTER_SETTING_MAIN_TYPE.USED_POINT:
        case CLUSTER_SETTING_MAIN_TYPE.POINT_USE:
        case CLUSTER_SETTING_MAIN_TYPE.BOOKING_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.NOT_CHECK_IN_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.MEMBER_SIGN_IN:
        case CLUSTER_SETTING_MAIN_TYPE.REFERRER_PEOPLE:
        case CLUSTER_SETTING_MAIN_TYPE.VALID_DISCOUNT_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_DISCOUNT_COUPON_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_WRITE_OFF:
        case CLUSTER_SETTING_MAIN_TYPE.COMMODITY_WRITE_OFF:
        case CLUSTER_SETTING_MAIN_TYPE.REWARD_CARD_DIFF_POINT:
        case CLUSTER_SETTING_MAIN_TYPE.RECEIVED_REWARD_CARD_POINT:
        case CLUSTER_SETTING_MAIN_TYPE.REWARD_CARD_REDEEM:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_PEOPLE:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_ORIGINAL_AMOUNT:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_PAID_AMOUNT:
        case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_AMOUNT:
        case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_POINT_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.DISCOUNT_POINT:
        case CLUSTER_SETTING_MAIN_TYPE.CANCEL_RETURN_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.CANCEL_RETURN_AMOUNT:
          const conditionalByRange = [
            'greater',
            'greaterEqual',
            'less',
            'lessEqual',
            'equal',
            'BETWEEN'
          ];
          if (!conditionalByRange.includes(setting?.data?.conditional)) {
            // 條件式不符合
            throw new CustomerException(configError._400004, HttpStatus.OK);
          }
          break;
        case CLUSTER_SETTING_MAIN_TYPE.POINT_ACTIVITY:
        case CLUSTER_SETTING_MAIN_TYPE.MEMBER_TAG:
        case CLUSTER_SETTING_MAIN_TYPE.BOOKING_BRAND:
        case CLUSTER_SETTING_MAIN_TYPE.RECEIVED_DISCOUNT_COUNT:
        case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_DISCOUNT_COUPON:
        case CLUSTER_SETTING_MAIN_TYPE.COMMODITY_COUPON:
        case CLUSTER_SETTING_MAIN_TYPE.WRITE_OFF_COMMODITY_COUPON:
        case CLUSTER_SETTING_MAIN_TYPE.NOT_WRITE_OFF_COMMODITY_COUPON:
        case CLUSTER_SETTING_MAIN_TYPE.REWARD_CARD:
        case CLUSTER_SETTING_MAIN_TYPE.RECEIVED_REWARD_CARD:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_BRAND:
        case CLUSTER_SETTING_MAIN_TYPE.ORDER_MEAL_DATE:
        case CLUSTER_SETTING_MAIN_TYPE.PAYMENT:
          const conditional = ['AND', 'OR'];
          if (!conditional.includes(setting?.data?.conditional)) {
            // 判斷條件式
            throw new CustomerException(configError._400004, HttpStatus.OK);
          }

          if (!setting?.data?.ids?.length) {
            // 空值
            throw new CustomerException(configError._400005, HttpStatus.OK);
          }
          break;
        case CLUSTER_SETTING_MAIN_TYPE.BOOKING_PEOPLE:
          if (!setting?.data?.adult || !setting?.data?.child) {
            // 格式不完整
            throw new CustomerException(configError._400004, HttpStatus.OK);
          }
          break;
        case CLUSTER_SETTING_MAIN_TYPE.DELIVERY:
          if (!setting?.data?.cityZip) {
            // 空值
            throw new CustomerException(configError._400005, HttpStatus.OK);
          }
          break;
      }
    }
  }
}
