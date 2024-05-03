import { HttpStatus, Injectable } from '@nestjs/common';
import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
import { MetaDataCommon } from 'src/Definition/Dto';
import { CLUSTER_MEMBER_TYPE } from 'src/Definition/Enum/Cluster/cluster.member.type.enum';
import {
  CLUSTER_EXPORT_STATUS_TYPE,
  CLUSTER_SETTING_TYPE
} from 'src/Definition/Enum/Cluster/cluster.setting.type.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import { generateSerialNumber, secondsUntilEndOfDay } from 'src/Utils/tools';

import { ENUM_SEND_TARGET } from 'src/Definition/Enum/Mot/send.target.enum';
import { GetMemberListDto } from '../Member/Dto';
import { MemberRepository } from '../Member/member.repository';
import { MotRepository } from '../Mot/mot.repository';
import {
  CountClusterMemberDto,
  CountClusterMemberResp
} from './Dto/count.cluster.member.dto';
import { DelClusterSettingDto } from './Dto/del.cluster.setting.dto';
import { GetClusterCommonSettingResp } from './Dto/get.cluster.common.setting.dto';
import {
  GetClusterDownloadListDto,
  GetClusterDownloadListResp
} from './Dto/get.cluster.download.list.dto';
import {
  GetClusterSettingDetailDto,
  GetClusterSettingDetailResp
} from './Dto/get.cluster.setting.detail.dto';
import {
  GetClusterSettingListDto,
  GetClusterSettingListResp
} from './Dto/get.cluster.setting.list.dto';
import { StopClusterSettingDto } from './Dto/stop.cluster.setting.dto';
import { UpdClusterCommonSettingDto } from './Dto/upd.cluster.common.setting.dto';
import { UpdClusterSettingDto } from './Dto/upd.cluster.setting.dto';
import { GetClusterDataStartDateAndEndDateResp } from './Interface/get.cluster.data.start.and.end.date.interface';
import { InsClusterSettingResp } from './Interface/ins.cluster.setting.interface';
import { ClusterSettingService } from './Setting/cluster.setting.service';
import { ClusterRepository } from './cluster.repository';

import moment = require('moment-timezone');

@Injectable()
export class ClusterService {
  constructor(
    private clusterRepository: ClusterRepository,
    private memberRepository: MemberRepository,
    private motRepository: MotRepository,
    private redisService: RedisService,
    private clusterSettingService: ClusterSettingService,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得分群共用設定
   *
   * @returns
   */
  async getClusterCommonSetting(): Promise<GetClusterCommonSettingResp> {
    const clusterSetting =
      await this.clusterRepository.getClusterCommonSetting();

    const result = <GetClusterCommonSettingResp>{};
    clusterSetting?.map((setting) => {
      switch (setting?.membersType) {
        case CLUSTER_MEMBER_TYPE.MAIN:
          result.mainMemberConsumerDay = setting?.consumer ?? 0;
          break;
        case CLUSTER_MEMBER_TYPE.DROWSY:
          result.drowsyMemberConsumerDay = setting?.consumer ?? 0;
          result.drowsyMemberNotConsumerDay = setting?.notConsumer ?? 0;
          break;
        case CLUSTER_MEMBER_TYPE.SLEEPY:
          result.sleepyMemberConsumerDay = setting?.consumer ?? 0;
          result.sleepyMemberNotConsumerDay = setting?.notConsumer ?? 0;
          break;
        case CLUSTER_MEMBER_TYPE.LOST:
          result.lostMemberNotConsumerDay = setting?.notConsumer ?? 0;
          break;
      }
    });

    return result;
  }

  /**
   * 修改分群通用設定
   *
   * @param req
   * @returns
   */
  async updClusterCommonSetting(
    req: UpdClusterCommonSettingDto
  ): Promise<Record<string, never>> {
    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      await this.clusterRepository.updClusterCommonSetting(
        connection,
        req,
        req?.iam?.authMemberId
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._400001, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 取得分群設定列表
   *
   * @param req
   * @returns
   */
  async getClusterSettingList(
    req: GetClusterSettingListDto
  ): Promise<GetClusterSettingListResp> {
    const clusterSettingList =
      await this.clusterRepository.getClusterSettingList(req);

    const clusterSettingCount =
      await this.clusterRepository.getClusterSettingListCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: clusterSettingCount,
      totalPage: Math.ceil(clusterSettingCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetClusterSettingListResp>{};
    result.metaData = metaData;
    result.clusterSettingList = clusterSettingList;

    return result;
  }

  /**
   * 取得分群設定明細
   *
   * @param req
   * @returns
   */
  async getClusterSettingDetail(
    req: GetClusterSettingDetailDto
  ): Promise<GetClusterSettingDetailResp> {
    const clusterDetail = await this.clusterRepository.getClusterDetail(
      req?.clusterId
    );

    const clusterSetting = await this.clusterRepository.getClusterSettingDetail(
      req?.clusterId
    );

    let positiveData: any = [];
    let negativeData: any = [];
    for (const setting of clusterSetting) {
      switch (setting?.clusterSettingType) {
        case CLUSTER_SETTING_TYPE.POSITIVE:
          positiveData.push({
            clusterType: setting?.clusterMainType,
            conditional: setting?.clusterConditional,
            setting: setting?.clusterSetting
          });
          break;
        case CLUSTER_SETTING_TYPE.NEGATIVE:
          negativeData.push({
            clusterType: setting?.clusterMainType,
            conditional: setting?.clusterConditional,
            setting: setting?.clusterSetting
          });
          break;
      }
    }

    const clusterExport = await this.clusterRepository.getClusterExport(
      req?.clusterId
    );

    const clusterExportNotify =
      await this.clusterRepository.getClusterExportNotify(req?.clusterId);

    const result = <GetClusterSettingDetailResp>{};
    result.clusterName = clusterDetail?.clusterName;
    result.clusterDescription = clusterDetail?.clusterDescription;
    result.exportStatus = clusterDetail?.exportStatus;
    result.exportStartDate = clusterDetail?.exportStartDate;
    result.exportEndDate = clusterDetail?.exportEndDate;
    result.monthEvery = clusterDetail?.monthEvery;
    result.exportDataType = clusterDetail?.exportDataType;
    result.positiveData = positiveData;
    result.negativeData = negativeData;
    result.exportParamsKey = clusterExport?.map((x) => {
      return x.clusterParamsKey;
    });
    result.notifyGroupData = clusterExportNotify;

    return result;
  }

  /**
   * 更新分群設定
   *
   * @param req
   * @returns
   */
  async updClusterSetting(
    req: UpdClusterSettingDto
  ): Promise<Record<string, never>> {
    // 檢查分群設定是否設置正確
    await this.clusterSettingService.chkClusterSetting(
      req?.positiveData,
      req?.negativeData
    );

    if (!req?.clusterId) {
      const date = moment().tz(process.env.TIME_ZONE).format('YYMMDD');
      req.clusterId = await this.createClusterId(date);
    } else {
      const clusterDetail = await this.clusterRepository.getClusterDetail(
        req?.clusterId
      );
      if (!clusterDetail) {
        throw new CustomerException(configError._400003, HttpStatus.OK);
      }
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      await this.clusterRepository.insClusterData(
        connection,
        req,
        req?.iam?.authMemberId
      );

      await this.clusterRepository.initClusterExport(
        connection,
        req?.clusterId,
        req?.iam?.authMemberId
      );

      if (req?.exportParamsKey?.length) {
        await this.clusterRepository.insClusterExport(
          connection,
          req?.clusterId,
          req?.exportParamsKey,
          req?.iam?.authMemberId
        );
      }

      await this.clusterRepository.initClusterExportNotify(
        connection,
        req?.clusterId,
        req?.iam?.authMemberId
      );

      if (req?.notifyGroupSeq?.length > 0) {
        await this.clusterRepository.insClusterExportNotify(
          connection,
          req?.clusterId,
          req?.notifyGroupSeq,
          req?.iam?.authMemberId
        );
      }

      await this.clusterRepository.initClusterSetting(
        connection,
        req?.clusterId,
        req?.iam?.authMemberId
      );

      const clusterSetting = await this.checkClusterSetting(req);
      await this.clusterRepository.insClusterSetting(
        connection,
        clusterSetting,
        req?.iam?.authMemberId
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._400002, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 計算分群會員觸及人數
   *
   * @param req
   * @returns
   */
  async countClusterMember(
    req: CountClusterMemberDto
  ): Promise<CountClusterMemberResp> {
    let memberCount: number = 0;
    let touchMemberCount: {
      memberIdCount: number;
      memberSendEmailCount: string;
      memberSendSmsCount: string;
    };

    if (!req?.sendTarget || req?.sendTarget === ENUM_SEND_TARGET.TARGET) {
      let clusterDate = <GetClusterDataStartDateAndEndDateResp>{};
      if (req?.exportStatus)
        clusterDate = await this.getClusterDataStartAndEndDate(
          req?.exportStatus,
          req?.monthEvery
        );

      touchMemberCount = await this.clusterSettingService.cluster(
        req?.positiveData,
        req?.negativeData,
        clusterDate
      );

      const getMemberListDto = <GetMemberListDto>{};
      memberCount = await this.memberRepository.getMemberListCount(
        getMemberListDto
      );
    }

    if (req?.sendTarget === ENUM_SEND_TARGET.ALL) {
      touchMemberCount = await this.motRepository.getTotalMemberTouchCount();
      memberCount = touchMemberCount?.memberIdCount ?? 0;
    }

    const result = <CountClusterMemberResp>{};
    result.totalMemberCount = memberCount;
    result.touchMemberCount = touchMemberCount?.memberIdCount ?? 0;
    result.memberSendAppCount = 0; // TODO:
    result.memberSendEmailCount = touchMemberCount?.memberSendEmailCount
      ? Number(touchMemberCount?.memberSendEmailCount)
      : 0;
    result.memberSendSmsCount = touchMemberCount?.memberSendSmsCount
      ? Number(touchMemberCount?.memberSendSmsCount)
      : 0;

    return result;
  }

  /**
   * 創建分群 ID
   *
   * @param date
   * @returns
   */
  async createClusterId(date: string): Promise<string> {
    let nextTransactionId;
    const redisKey = `${config.REDIS_KEY.MAX_CLUSTER_ID}:${date}`;
    nextTransactionId = await this.redisService.rpopData(redisKey);
    if (nextTransactionId) return nextTransactionId;

    const prefix = `CL${date}`;
    const maxClusterId = await this.clusterRepository.getMaxClusterId();

    let seq = 1;
    if (maxClusterId) {
      const maxDate = maxClusterId.substring(2, 8);
      if (date == maxDate) {
        seq = Number(maxClusterId.substring(8, 13));
      }
    }

    const transactionIds: string[] = generateSerialNumber(prefix, seq, 5);
    await this.redisService.lpushData(
      redisKey,
      transactionIds,
      secondsUntilEndOfDay()
    );

    nextTransactionId = await this.redisService.rpopData(redisKey);

    return nextTransactionId;
  }

  /**
   * 檢查分群設定
   *
   * @param req
   * @returns
   */
  async checkClusterSetting(
    req: UpdClusterSettingDto
  ): Promise<InsClusterSettingResp[]> {
    const insClusterSettingResp: InsClusterSettingResp[] = [];
    for (const data of req?.positiveData) {
      insClusterSettingResp.push({
        clusterId: req?.clusterId,
        clusterMainType: data?.clusterType,
        clusterConditional: data?.conditional ?? 'AND',
        clusterSettingType: CLUSTER_SETTING_TYPE.POSITIVE,
        clusterSetting: data?.setting
      });
    }

    for (const data of req?.negativeData) {
      insClusterSettingResp.push({
        clusterId: req?.clusterId,
        clusterMainType: data?.clusterType,
        clusterConditional: data?.conditional ?? 'AND',
        clusterSettingType: CLUSTER_SETTING_TYPE.NEGATIVE,
        clusterSetting: data?.setting
      });
    }

    return insClusterSettingResp;
  }

  /**
   * 取得分群資料的起訖日
   *
   * @param exportStatus
   * @param monthEvery
   * @returns
   */
  async getClusterDataStartAndEndDate(
    exportStatus: string,
    monthEvery: number
  ): Promise<GetClusterDataStartDateAndEndDateResp> {
    const date = <GetClusterDataStartDateAndEndDateResp>{};
    switch (exportStatus) {
      case CLUSTER_EXPORT_STATUS_TYPE.EVERY_HALF_MONTH:
        date.start = moment().utc().add(-15, 'd').format('YYYY/MM/DD');
        date.end = moment().utc().format('YYYY/MM/DD');
        break;
      case CLUSTER_EXPORT_STATUS_TYPE.EVERY_MONTH:
        date.start = moment().utc().add(-1, 'm').format('YYYY/MM/DD');
        date.end = moment().utc().format('YYYY/MM/DD');
        break;
      case CLUSTER_EXPORT_STATUS_TYPE.EVERY_QUARTER:
        date.start = moment().utc().add(-3, 'm').format('YYYY/MM/DD');
        date.end = moment().utc().format('YYYY/MM/DD');
        break;
      case CLUSTER_EXPORT_STATUS_TYPE.SPECIFIED_RANGE_DATE:
        date.start = moment().utc().add(-monthEvery, 'm').format('YYYY/MM/DD');
        date.end = moment().utc().format('YYYY/MM/DD');
        break;
      default:
        date.start = moment()
          .utc()
          .add(-3, 'y')
          .startOf('year')
          .format('YYYY/MM/DD');
        date.end = moment().utc().format('YYYY/MM/DD');
    }

    return date;
  }

  /**
   * 取得分群下載列表
   *
   * @param req
   * @returns
   */
  async getClusterDownloadList(
    req: GetClusterDownloadListDto
  ): Promise<GetClusterDownloadListResp> {
    const clusterDownloadList =
      await this.clusterRepository.getClusterDownloadList(req);

    const clusterDownloadCount =
      await this.clusterRepository.getClusterDownloadListCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: clusterDownloadCount,
      totalPage: Math.ceil(clusterDownloadCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetClusterDownloadListResp>{};
    result.metaData = metaData;
    result.clusterDownloadList = clusterDownloadList;

    return result;
  }

  /**
   * 停用分群設定
   *
   * @param req
   * @returns
   */
  async stopClusterSetting(
    req: StopClusterSettingDto
  ): Promise<Record<string, never>> {
    await this.clusterRepository.stopClusterSetting(
      req?.clusterId,
      req?.iam?.authMemberId
    );

    return {};
  }

  /**
   * 刪除分群設定
   *
   * @param req
   * @returns
   */
  async delClusterSetting(
    req: DelClusterSettingDto
  ): Promise<Record<string, never>> {
    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      await this.clusterRepository.delClusterData(
        connection,
        req?.clusterId,
        req?.iam?.authMemberId
      );

      await this.clusterRepository.delClusterExport(
        connection,
        req?.clusterId,
        req?.iam?.authMemberId
      );

      await this.clusterRepository.delClusterExportNotify(
        connection,
        req?.clusterId,
        req?.iam?.authMemberId
      );

      await this.clusterRepository.delClusterSetting(
        connection,
        req?.clusterId,
        req?.iam?.authMemberId
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._400006, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }
}
