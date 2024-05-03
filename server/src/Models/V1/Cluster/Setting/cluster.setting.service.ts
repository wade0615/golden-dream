import { HttpStatus, Injectable } from '@nestjs/common';
import configError from 'src/Config/error.message.config';
import { CLUSTER_MAIN_TYPE } from 'src/Definition/Enum/Cluster/cluster.setting.type.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { CommonService } from '../../Common/common.service';
import { ClusterTempData } from '../Interface/cluster.temp.data.interface';
import { GetClusterDataStartDateAndEndDateResp } from '../Interface/get.cluster.data.start.and.end.date.interface';
import { ClusterRepository } from '../cluster.repository';
import { BasicClusterModule } from './cluster.basic.module';
import { MemberActivitiesClusterModule } from './cluster.member.activities.module';

@Injectable()
export class ClusterSettingService {
  constructor(
    private readonly commonService: CommonService,
    private readonly clusterRepository: ClusterRepository
  ) {}

  /**
   * 根據分群設定，取得會員、消費等資料
   *
   * @param positiveData
   * @param negativeData
   * @param orderDate
   * @returns
   */
  async cluster(
    positiveData,
    negativeData,
    orderDate: GetClusterDataStartDateAndEndDateResp
  ): Promise<{
    memberIdCount: number;
    memberSendEmailCount: string;
    memberSendSmsCount: string;
  }> {
    const basicClusterModule = new BasicClusterModule(
      this.clusterRepository,
      this.commonService
    );
    const memberActivitiesClusterModule = new MemberActivitiesClusterModule(
      this.clusterRepository,
      this.commonService
    );

    let clusterTempSqlData = <ClusterTempData>{
      positiveTempTables: [],
      clusterSql: [],
      tempClusterDetailJoinTables: []
    };

    // 根據分群條件，取得會員、消費等資料
    for (const cluster of positiveData) {
      switch (cluster.clusterType) {
        case CLUSTER_MAIN_TYPE.BASIC:
          clusterTempSqlData = await basicClusterModule.handleCluster(
            cluster.setting,
            '',
            cluster.conditional,
            clusterTempSqlData
          );
          break;
        case CLUSTER_MAIN_TYPE.MEMBER_ACTIVITIES:
        case CLUSTER_MAIN_TYPE.CONSUME:
          clusterTempSqlData =
            await memberActivitiesClusterModule.handleCluster(
              cluster.setting,
              '',
              orderDate?.start,
              orderDate?.end,
              clusterTempSqlData
            );
          break;
      }
    }

    for (const cluster of negativeData) {
      switch (cluster.clusterType) {
        case CLUSTER_MAIN_TYPE.BASIC:
          clusterTempSqlData = await basicClusterModule.handleCluster(
            cluster.setting,
            'NOT',
            cluster.conditional,
            clusterTempSqlData
          );
          break;
        case CLUSTER_MAIN_TYPE.MEMBER_ACTIVITIES:
        case CLUSTER_MAIN_TYPE.CONSUME:
          clusterTempSqlData =
            await memberActivitiesClusterModule.handleCluster(
              cluster.setting,
              'NOT',
              orderDate?.start,
              orderDate?.end,
              clusterTempSqlData
            );
          break;
      }
    }

    const memberCount =
      await this.clusterRepository.getTempClusterMemberIdCount(
        clusterTempSqlData
      );

    return memberCount;
  }

  /**
   * 檢查分群設定
   *
   * @param positiveData 觸及條件設定
   * @param negativeData 排除條件設定
   */
  async chkClusterSetting(positiveData, negativeData) {
    const basicClusterModule = new BasicClusterModule(
      this.clusterRepository,
      this.commonService
    );
    const memberActivitiesClusterModule = new MemberActivitiesClusterModule(
      this.clusterRepository,
      this.commonService
    );

    // 檢查分群觸及條件
    for (const cluster of positiveData) {
      switch (cluster.clusterType) {
        case CLUSTER_MAIN_TYPE.BASIC:
          await basicClusterModule.chkClusterSetting(cluster.setting);
          break;
        case CLUSTER_MAIN_TYPE.MEMBER_ACTIVITIES:
        case CLUSTER_MAIN_TYPE.CONSUME:
          await memberActivitiesClusterModule.chkClusterSetting(
            cluster.setting
          );
          break;
        default:
          throw new CustomerException(configError._400004, HttpStatus.OK);
      }
    }

    // 檢查分群排除條件
    for (const cluster of negativeData) {
      switch (cluster.clusterType) {
        case CLUSTER_MAIN_TYPE.BASIC:
          await basicClusterModule.chkClusterSetting(cluster.setting);
          break;
        case CLUSTER_MAIN_TYPE.MEMBER_ACTIVITIES:
        case CLUSTER_MAIN_TYPE.CONSUME:
          await memberActivitiesClusterModule.chkClusterSetting(
            cluster.setting
          );
          break;
        default:
          throw new CustomerException(configError._400004, HttpStatus.OK);
      }
    }
  }
}
