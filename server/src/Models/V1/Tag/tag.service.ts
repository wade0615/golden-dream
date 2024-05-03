import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import configError from 'src/Config/error.message.config';
import { MetaDataCommon } from 'src/Definition/Dto';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { CsvDownloadExample } from 'src/Utils/DataFrame/csv.download.example';
import { CommonRepository } from '../Common/common.repository';
import { CommonService } from '../Common/common.service';
import { MemberRepository } from '../Member/member.repository';
import { MemberService } from '../Member/member.service';
import { AddTagMemberDto } from './Dto/add.tag.member.dto';
import { DelTagDataDto } from './Dto/del.tag.data.dto';
import { DelTagGroupDto } from './Dto/del.tag.group.dto';
import { DelTagMemberDto } from './Dto/del.tag.member.dto';
import { DownloadTagDataResp } from './Dto/download.tag.data';
import { GetTagDetailDto, GetTagDetailResp } from './Dto/get.tag.detail.dto';
import { GetTagGroupListResp } from './Dto/get.tag.group.list.dto';
import { GetTagGroupMenuResp } from './Dto/get.tag.group.menu.dto';
import { GetTagListDto, GetTagListResp } from './Dto/get.tag.list.dto';
import {
  GetTagMemberListDto,
  GetTagMemberListResp
} from './Dto/get.tag.member.list.dto';
import { GetTagMenuResp } from './Dto/get.tag.menu.dto';
import { InsTagDataDto } from './Dto/ins.tag.data.dto';
import { InsTagGroupDto } from './Dto/ins.tag.group.dto';
import { StopTagStatusDto } from './Dto/stop.tag.status.dto';
import { UpdTagGroupSortDto } from './Dto/upd.tag.group.sort.dto';
import { TagRepository } from './tag.repository';
import moment = require('moment-timezone');

@Injectable()
export class TagService {
  constructor(
    private tagRepository: TagRepository,
    private memberRepository: MemberRepository,
    private commonRepository: CommonRepository,
    private commonService: CommonService,
    private memberService: MemberService,
    private csvDownloadExample: CsvDownloadExample,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 取得標籤列表
   *
   * @param req
   * @returns
   */
  async getTagList(req: GetTagListDto): Promise<GetTagListResp> {
    const tagList = await this.tagRepository.getTagList(req);

    const tagListCount = await this.tagRepository.getTagListCount(req);

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: tagListCount,
      totalPage: Math.ceil(tagListCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetTagListResp>{};
    result.metaData = metaData;
    result.tagList = tagList;

    return result;
  }

  /**
   * 取得標籤詳情
   *
   * @param req
   * @returns
   */
  async getTagDetail(req: GetTagDetailDto): Promise<GetTagDetailResp> {
    const tagDetail = await this.tagRepository.getTagDetail(req?.tagId);
    if (!tagDetail) {
      throw new CustomerException(configError._390003, HttpStatus.OK);
    }

    const result = <GetTagDetailResp>{};
    result.tagId = tagDetail?.tagId;
    result.tagGroupId = tagDetail?.tagGroupId;
    result.tagName = tagDetail?.tagName;
    result.tagActiveType = tagDetail?.tagActiveType;
    result.state =
      tagDetail?.endDate && moment(tagDetail?.endDate).isBefore(moment().utc())
        ? 0
        : tagDetail?.state;
    result.endDate = tagDetail?.endDate;
    result.description = tagDetail?.description;
    result.tagCount = tagDetail?.tagCount;

    return result;
  }

  /**
   * 新增標籤資料
   *
   * @param req
   * @returns
   */
  async insTagData(req: InsTagDataDto): Promise<Record<string, never>> {
    if (req?.tagId) {
      const tagDetail = await this.tagRepository.getTagDetail(req?.tagId);
      if (!tagDetail) {
        throw new CustomerException(configError._390003, HttpStatus.OK);
      }
    }

    const tagDetailByName = await this.tagRepository.getTagDetailByName(
      req?.tagName
    );
    if (
      tagDetailByName?.tagName == req?.tagName &&
      (req?.tagId == 0 || req?.tagId != tagDetailByName?.tagId)
    ) {
      throw new CustomerException(configError._390004, HttpStatus.OK);
    }

    await this.tagRepository.insTagData(req);

    return {};
  }

  /**
   * 停用標籤
   *
   * @param req
   * @returns
   */
  async stopTagStatus(req: StopTagStatusDto): Promise<Record<string, never>> {
    const tagDetails = await this.tagRepository.getTagDetails(req?.tagIds);
    if (tagDetails?.length != req?.tagIds?.length) {
      throw new CustomerException(configError._390005, HttpStatus.OK);
    }

    await this.tagRepository.stopTagStatus(req?.tagIds, req?.iam?.authMemberId);

    return {};
  }

  /**
   * 刪除標籤
   *
   * @param req
   * @returns
   */
  async delTagData(req: DelTagDataDto): Promise<Record<string, never>> {
    const tagDetails = await this.tagRepository.getTagDetails(req?.tagIds);
    if (tagDetails?.length != req?.tagIds?.length) {
      throw new CustomerException(configError._390005, HttpStatus.OK);
    }

    for (const detail of tagDetails) {
      if (detail?.tagCount > 0) {
        throw new CustomerException(configError._390006, HttpStatus.OK);
      }
    }

    await this.tagRepository.delTagData(req?.tagIds, req?.iam?.authMemberId);

    return {};
  }

  /**
   * 下載批次貼標籤範本
   *
   * @param res
   * @returns
   */
  async downloadTagExample(res: Response): Promise<DownloadTagDataResp> {
    const buffer = await this.csvDownloadExample.mobileCsvExample(
      '批量設定會員標籤'
    );

    const filename = '批量設定會員標籤_匯入範本.csv';
    const mimeType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`
    );

    res.send(buffer);

    const result = <DownloadTagDataResp>{};
    result.buffer = buffer;

    return result;
  }

  /**
   * 取得標籤下拉式選單
   *
   * @returns
   */
  async getTagMenu(): Promise<GetTagMenuResp[]> {
    const tagMenuData = await this.tagRepository.getTagMenuData();

    return tagMenuData;
  }

  /**
   * 取得標籤分類下拉式選單
   *
   * @returns
   */
  async getTagGroupMenu(): Promise<GetTagGroupMenuResp[]> {
    const tagGroupList = await this.tagRepository.getTagGroupList();

    const result = [] as GetTagGroupMenuResp[];
    tagGroupList?.forEach((x) => {
      result.push({
        id: Number(x.tagGroupId),
        name: x.tagGroupName
      });
    });

    return result;
  }

  /**
   * 取得標籤分類列表
   *
   * @returns
   */
  async getTagGroupList(): Promise<GetTagGroupListResp[]> {
    const result = await this.tagRepository.getTagGroupList();

    return result;
  }

  /**
   * 新增標籤分類
   *
   * @param req
   * @returns
   */
  async insTagGroup(req: InsTagGroupDto): Promise<Record<string, never>> {
    if (req?.tagGroupId) {
      const tagGroupDetail = await this.tagRepository.getTagGroupDetail(
        req?.tagGroupId
      );

      if (!tagGroupDetail) {
        throw new CustomerException(configError._390001, HttpStatus.OK);
      }
    }

    await this.tagRepository.insTagGroup(req, req?.iam?.authMemberId);

    return {};
  }

  /**
   * 刪除標籤分類
   *
   * @param req
   * @returns
   */
  async delTagGroup(req: DelTagGroupDto): Promise<Record<string, never>> {
    const tagGroupDetail = await this.tagRepository.getTagGroupDetail(
      req?.tagGroupId
    );

    if (!tagGroupDetail) {
      throw new CustomerException(configError._390001, HttpStatus.OK);
    }

    await this.tagRepository.delTagGroup(
      req?.tagGroupId,
      req?.iam?.authMemberId
    );

    return {};
  }

  /**
   * 修改標籤分類排序
   *
   * @param req
   * @returns
   */
  async updTagGroupSort(
    req: UpdTagGroupSortDto
  ): Promise<Record<string, never>> {
    const tagGroupDetails = await this.tagRepository.getTagGroupDetails(
      req?.tagGroupIds
    );

    if (tagGroupDetails?.length != req?.tagGroupIds?.length) {
      throw new CustomerException(configError._390002, HttpStatus.OK);
    }

    const connection = await this.internalConn.getConnection();
    try {
      await connection.beginTransaction();
      // 批次更新標籤分類順序
      let rank = 0;
      for (const tagGroupId of req?.tagGroupIds) {
        await this.tagRepository.updTagGroupSort(
          connection,
          tagGroupId,
          rank,
          req?.iam?.authMemberId
        );

        rank++;
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._390002, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 新增會員標籤
   *
   * @param file
   * @param req
   * @param authMemberId
   * @returns
   */
  async addTagMember(
    file: Express.Multer.File,
    req: AddTagMemberDto,
    authMemberId: string
  ): Promise<Record<string, never>> {
    let memberIds = [];
    let url = null;
    // 有上傳檔案
    if (file?.originalname) {
      const mobileDate = await this.memberService.chkUploadMobileCsv(
        file,
        true
      );

      const csvMemberId = await this.memberRepository.getTempCsvMemberId(
        mobileDate?.csvTempTableName,
        mobileDate?.csvSql
      );

      memberIds = csvMemberId?.map((data) => {
        return data?.memberId;
      });

      url = mobileDate?.urls?.[0];
      // 指定會員
    } else if (req?.mobileCountryCode && req?.mobile) {
      const memberDetail = await this.memberRepository.getMemberDetailByMobile(
        req?.mobileCountryCode,
        req?.mobile
      );
      if (!memberDetail) {
        throw new CustomerException(configError._220005, HttpStatus.OK);
      }

      memberIds = [memberDetail?.id];
    } else {
      throw new CustomerException(configError._200001, HttpStatus.OK);
    }

    const tagDetails = await this.tagRepository.getTagDetails(req?.tagIds);
    // 判斷使否有不存在的標籤
    if (tagDetails?.length != req?.tagIds?.length) {
      throw new CustomerException(configError._390005, HttpStatus.OK);
    }

    const id = await this.tagRepository.addTagUploadLog(
      'ADD',
      url,
      memberIds?.length,
      authMemberId
    );

    const connection = await this.internalConn.getConnection();
    try {
      for (const tagId of req?.tagIds) {
        await this.tagRepository.insTagUploadMap(
          connection,
          id,
          tagId,
          authMemberId
        );

        for (const memberId of memberIds) {
          await this.tagRepository.insTagMember(
            connection,
            tagId,
            memberId,
            authMemberId
          );
        }
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._390007, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 刪除會員標籤
   *
   * @param req
   * @returns
   */
  async delTagMember(
    file: Express.Multer.File,
    req: DelTagMemberDto,
    authMemberId: string
  ): Promise<Record<string, never>> {
    let memberIds = [];
    let url = null;
    // 有上傳檔案
    if (file?.originalname) {
      const mobileDate = await this.memberService.chkUploadMobileCsv(
        file,
        true
      );

      const csvMemberId = await this.memberRepository.getTempCsvMemberId(
        mobileDate?.csvTempTableName,
        mobileDate?.csvSql
      );

      memberIds = csvMemberId?.map((data) => {
        return data?.memberId;
      });

      url = mobileDate?.urls?.[0];
      // 指定會員
    } else if (req?.mobileCountryCode && req?.mobile) {
      const memberDetail = await this.memberRepository.getMemberDetailByMobile(
        req?.mobileCountryCode,
        req?.mobile
      );
      if (!memberDetail) {
        throw new CustomerException(configError._220005, HttpStatus.OK);
      }

      memberIds = [memberDetail?.id];
    }

    const tagDetails = await this.tagRepository.getTagDetails(req?.tagIds);
    // 判斷使否有不存在的標籤
    if (tagDetails?.length != req?.tagIds?.length) {
      throw new CustomerException(configError._390005, HttpStatus.OK);
    }

    await this.tagRepository.delTagMember(memberIds, req?.tagIds, authMemberId);

    const id = await this.tagRepository.addTagUploadLog(
      'DEL',
      url,
      memberIds?.length,
      authMemberId
    );

    const connection = await this.internalConn.getConnection();
    try {
      for (const tagId of req?.tagIds) {
        await this.tagRepository.insTagUploadMap(
          connection,
          id,
          tagId,
          authMemberId
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(configError._390008, HttpStatus.OK);
    } finally {
      await connection.release();
    }

    return {};
  }

  /**
   * 取得貼標列表
   *
   * @param req
   * @returns
   */
  async getTagMemberList(
    req: GetTagMemberListDto
  ): Promise<GetTagMemberListResp> {
    const tagMemberList = await this.tagRepository.getTagMemberList(req);

    const tagMemberListCount = await this.tagRepository.getTagMemberListCount(
      req
    );

    const metaData = {
      page: req?.page,
      perPage: req?.perPage,
      totalCount: tagMemberListCount,
      totalPage: Math.ceil(tagMemberListCount / req?.perPage)
    } as MetaDataCommon;

    const result = <GetTagMemberListResp>{};
    result.metaData = metaData;
    result.tagMemberList = tagMemberList;

    return result;
  }
}
