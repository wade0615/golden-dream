import { HttpStatus } from '@nestjs/common';
import configError from 'src/Config/error.message.config';
import {
  CLUSTER_SETTING_CONDITIONAL_TYPE,
  CLUSTER_SETTING_MAIN_TYPE
} from 'src/Definition/Enum/Cluster/cluster.setting.type.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { v4 as ruuidv4 } from 'uuid';
import { ClusterTempData } from '../Interface/cluster.temp.data.interface';
import { ClusterSettingModule } from './cluster.setting.module';

/**
 * 分群設定 - 基本資料
 */
export class BasicClusterModule extends ClusterSettingModule {
  /**
   * 處理分群
   *
   * @param setting
   * @param exclude
   * @param conditional
   * @param clusterTempData
   * @returns
   */
  public async handleCluster(
    setting,
    exclude: string,
    conditional: string,
    clusterTempData: ClusterTempData
  ): Promise<ClusterTempData> {
    const tempClusterTable = `Temp_Cluster_${ruuidv4().replace(/-/g, '_')}`;
    if (
      !clusterTempData?.tempClusterDetailJoinTables.includes(tempClusterTable)
    ) {
      clusterTempData?.tempClusterDetailJoinTables.push(tempClusterTable);
    }

    clusterTempData = await this.clusterRepository.getMemberClusterSql(
      tempClusterTable,
      setting,
      exclude,
      clusterTempData
    );

    if (conditional == CLUSTER_SETTING_CONDITIONAL_TYPE.AND) {
      clusterTempData.positiveTempTables = [tempClusterTable];
    } else {
      clusterTempData.positiveTempTables.push(tempClusterTable);
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
        case CLUSTER_SETTING_MAIN_TYPE.GENDER:
        case CLUSTER_SETTING_MAIN_TYPE.BIRTHDAY_MONTH:
        case CLUSTER_SETTING_MAIN_TYPE.REGISTRATION_CHANNEL:
        case CLUSTER_SETTING_MAIN_TYPE.OPEN_CHANNEL:
        case CLUSTER_SETTING_MAIN_TYPE.UN_OPEN_CHANNEL:
        case CLUSTER_SETTING_MAIN_TYPE.SPECIAL_MEMBER_TYPE:
          if (!setting?.data?.ids?.length) {
            throw new CustomerException(configError._400005, HttpStatus.OK);
          }
          break;
        case CLUSTER_SETTING_MAIN_TYPE.AGE:
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
        case CLUSTER_SETTING_MAIN_TYPE.ADDRESS:
          if (!setting?.data?.cityZip) {
            throw new CustomerException(configError._400005, HttpStatus.OK);
          }
          break;
        case CLUSTER_SETTING_MAIN_TYPE.REGISTRATION_DATE:
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
      }
    }
  }
}
