import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigKafkaService } from 'src/Config/Database/Kafka/config.service';
import { LOG_ACTION } from 'src/Definition/Enum/Log/log.channel.action.enum';
import { KAFKA_SYNC_TYPE } from '../Channel/Enum/kafka.enum';
import { ChannelRepository } from '../Channel/channel.repository';
import { CouponService } from '../Coupon/coupon.service';
import { MemberRepository } from '../Member/member.repository';
import { MemberService } from '../Member/member.service';
import { GetBasicMemberShipSettingResp } from '../MemberShip/Interface/get.basic.member.ship.setting.interface';
import { MemberShipService } from '../MemberShip/memberShip.service';
const { Kafka } = require('kafkajs');

@Injectable()
export class OnmService implements OnModuleInit {
  private kafka = null;
  constructor(
    private readonly configKafkaService: ConfigKafkaService,
    private memberRepository: MemberRepository,
    private memberShipService: MemberShipService,
    private couponService: CouponService,
    private memberService: MemberService,
    private channelRepository: ChannelRepository
  ) {
    this.kafka = new Kafka({
      clientId: 'CRM-Backend',
      brokers: [
        `${this.configKafkaService.host}:${this.configKafkaService.port}`
      ],
      sasl: {
        mechanism: 'PLAIN',
        username: this.configKafkaService.userName,
        password: this.configKafkaService.password
      }
    });
  }
  /**
   * Kafka 連線
   *
   */
  async onModuleInit() {
    try {
      const groupId = 'ieat-crm-backend-local';

      const consumer = this.kafka.consumer({ groupId: groupId });

      await consumer.connect();
      await consumer.subscribe({
        topics: [
          KAFKA_SYNC_TYPE.REGISTER,
          KAFKA_SYNC_TYPE.PHONE_VERIFY,
          KAFKA_SYNC_TYPE.UPDATE_MEMBER,
          KAFKA_SYNC_TYPE.DELETE_MEMBER,
          KAFKA_SYNC_TYPE.CHANNEL_ACTION_LOG
        ],
        fromBeginning: true
      });
      await consumer.run({
        eachMessage: async ({ topic, partition, message, heartbeat }) => {
          const req = message.value.toString();
          switch (topic) {
            case KAFKA_SYNC_TYPE.REGISTER:
              await this.memberDataSync(req);
              break;
            case KAFKA_SYNC_TYPE.PHONE_VERIFY:
              await this.memberVerifySync(req);
              break;
            case KAFKA_SYNC_TYPE.UPDATE_MEMBER:
              await this.memberInfoSync(req);
              break;
            case KAFKA_SYNC_TYPE.DELETE_MEMBER:
              await this.delMember(req);
              break;
            case KAFKA_SYNC_TYPE.CHANNEL_ACTION_LOG:
              await this.insMemberChannelActionLog(req);
              break;
          }
        }
      });
    } catch (err) {
      console.log('[Data-Sync Error]', err);
    }
  }

  /**
   * 資料同步註冊
   *
   * @param req
   * @returns
   */
  async memberDataSync(res: string): Promise<void> {
    try {
      const dataSet: any = JSON.parse(res);
      console.log(dataSet);
      // 取得初階會籍
      const basicMemberShipSetting: GetBasicMemberShipSettingResp =
        await this.memberShipService.getBasicMemberShipSetting();

      // 特殊判別：2020/2/29 加入／升等，則2021/3/1-23:59 到期
      let memberShipSetting;
      if (basicMemberShipSetting?.memberShipId) {
        memberShipSetting =
          await this.memberShipService.calcMemberShipStartEndDate(
            basicMemberShipSetting
          );
      } else {
        memberShipSetting = null;
      }
      // 註冊資訊寫進 DB（狀態為未開通）
      const registerReq = <any>{};
      registerReq.req = dataSet.req;
      registerReq.referrerCode = dataSet.referrerCode;
      registerReq.channelId = dataSet.channelId;
      registerReq.memberId = dataSet.memberId;
      registerReq.memberCardNo = dataSet.memberCardNo;
      registerReq.memberShipId = memberShipSetting?.memberShipId;
      registerReq.memberShipStartDate = memberShipSetting?.today;
      registerReq.memberShipEndDate = memberShipSetting?.memberShipEndDate;
      registerReq.addressCode = dataSet.addressCode;
      const memberId = await this.memberService.syncDataFromOauth(registerReq);

      // 註冊成功發送會員禮，調整為API
      try {
        await this.couponService.sendRegisterCoupon(
          dataSet.memberId,
          basicMemberShipSetting?.settingId
        );
      } catch (error) {
        // 寫事件到禮品發送表
        await this.couponService.sendErrorGiftEvent(
          dataSet.memberId,
          memberShipSetting?.memberShipId
        );
      }

      // 渠道註冊、互動紀錄
      const inserLog = [];
      inserLog.push(
        {
          channelId: dataSet?.channelId,
          memberId: memberId,
          channelAction: LOG_ACTION.REGISTER
        },
        {
          channelId: dataSet?.channelId,
          memberId: memberId,
          channelAction: LOG_ACTION.SIGN_IN
        }
      );

      await this.channelRepository.insChannelLog(inserLog);
    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
    }
  }

  /**
   * 同步手機驗證狀態
   *
   * @param req
   * @returns
   */
  async memberVerifySync(res: string): Promise<void> {
    try {
      const dataSet: any = JSON.parse(res);
      console.log(dataSet);
      await this.memberRepository.syncMemberMobileEnable(dataSet);
    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
    }
  }

  /**
   * 同步會員資訊
   *
   * @param req
   * @returns
   */
  async memberInfoSync(res: string): Promise<void> {
    try {
      const dataSet: any = JSON.parse(res);
      console.log(dataSet);
      await this.memberRepository.syncMemberInfo(dataSet);
    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
    }
  }

  /**
   * 註銷會員
   *
   * @param req
   * @returns
   */
  async delMember(res: string): Promise<void> {
    try {
      const dataSet: any = JSON.parse(res);
      console.log(dataSet);
      await this.memberRepository.syncMemberInfo(dataSet);
    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
    }
  }

  /**
   * 新增會員渠道互動紀錄
   *
   * @param res
   */
  async insMemberChannelActionLog(res: string): Promise<void> {
    try {
      const dataSet: any = JSON.parse(res);
      console.log(dataSet);
      await this.memberRepository.insChannelLog(dataSet);
    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
    }
  }
}
