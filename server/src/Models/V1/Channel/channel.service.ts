import { HttpStatus, Injectable } from '@nestjs/common';
import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { BrandRepository } from 'src/Models/V1/Brand/brand.repository';
import {
  BrandDetail,
  GetChannelListResp,
  UpdChannelDetailDto,
  UpdChannelSortDto
} from 'src/Models/V1/Channel/Dto';
import { InsChannelDetailReq } from 'src/Models/V1/Channel/Interface/ins.channel.detail.interface';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { GetChannelMenuResp } from './Dto/get.channel.menu.dto';
import { ChannelRepository } from './channel.repository';

@Injectable()
export class ChannelService {
  constructor(
    private channelRepository: ChannelRepository,
    private brandRepository: BrandRepository,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得渠道列表
   *
   * @returns
   */
  async getChannelList(): Promise<GetChannelListResp[]> {
    // 取得渠道列表
    const channelList = await this.channelRepository.getChannelList();

    const channelListTmp = <GetChannelListResp>{};
    channelList.map((channel) => {
      if (!channelListTmp[channel.channelId]) {
        channelListTmp[channel.channelId] = {
          channelId: channel.channelId,
          channelName: channel.channelName,
          pointCalculation: channel.pointCalculation,
          brandDetail: [] as BrandDetail[]
        } as GetChannelListResp;
      }

      if (channel.brandId) {
        channelListTmp[channel.channelId].brandDetail.push({
          brandId: channel.brandId,
          brandName: channel.brandName
        });
      }
    });

    const result = [] as GetChannelListResp[];
    for (const channel in channelListTmp) {
      result.push(channelListTmp[channel]);
    }

    return result;
  }

  /**
   * 修改渠道排序
   *
   * @param req
   * @returns
   */
  async updChannelSort(req: UpdChannelSortDto): Promise<Record<string, never>> {
    // 無異動
    if (req?.channelRanks.length == 0) {
      throw new CustomerException(configError._200007, HttpStatus.OK);
    }

    const channelList = await this.channelRepository.getChannelTotalData();

    // 判斷修改排序的數量是否為全部
    if (channelList?.length != req?.channelRanks.length) {
      // TODO ELK LOG 待補
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 批次更新渠道順序
      let rank = 1;
      for (const channelId of req?.channelRanks) {
        await this.channelRepository.updChannelSort(
          connection,
          channelId,
          rank,
          req?.iam?.authMemberId
        );
        rank++;
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._250003, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 修改渠道資料
   *
   * @param req
   * @returns
   */
  async updChannelDetail(
    req: UpdChannelDetailDto
  ): Promise<Record<string, never>> {
    if (req?.channelList.length == 0) {
      throw new CustomerException(configError._200007, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();

      for (const channel of req?.channelList) {
        // 取得全品牌資料
        const brandList = await this.brandRepository.getBrandSettingList();

        // 整理開放或關閉的品牌
        const insChannelBrands = [] as InsChannelDetailReq[];
        for (const brand of brandList) {
          insChannelBrands.push({
            brandId: brand?.brandId,
            channelId: channel?.channelId,
            isActive: channel?.brandIds?.includes(brand?.brandId) ? true : false
          });
        }

        // 更新會籍、積點計算訂單
        await this.channelRepository.updChannelDetail(
          connection,
          channel?.channelId,
          channel?.pointCalculation,
          req?.iam?.authMemberId
        );

        // 更新渠道品牌資料
        await this.channelRepository.insChannelDetail(
          connection,
          insChannelBrands,
          req?.iam?.authMemberId
        );
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._250004, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 取得渠道下拉式選單
   *
   * @returns
   */
  async getChannelMenu(): Promise<GetChannelMenuResp> {
    const menuIdCommon = await this.channelRepository.getChannelMenu();

    const result = <GetChannelMenuResp>{};
    result.list = menuIdCommon;

    return result;
  }
}
