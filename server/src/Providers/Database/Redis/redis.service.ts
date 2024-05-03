import { HttpStatus, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigRedisService } from 'src/Config/Database/Redis/config.service';
import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
import {
  CacheRefreshInfo,
  CacheUserInfo
} from 'src/Definition/Interface/Cache/cache.interface';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
@Injectable()
export class RedisService {
  private client = null;
  constructor(private readonly configRedisService: ConfigRedisService) {
    this.client = new Redis({
      host: this.configRedisService.host,
      port: this.configRedisService.port,
      password: this.configRedisService.password,
      lazyConnect: true
    });
  }

  /**
   * get value from redis cache.
   * @param key string
   * @returns
   */
  async getCacheData(key: string) {
    if (!this.client) {
      await this.client;
    }

    let result;

    await this.client.get(key, async (err, data) => {
      if (err) {
        console.log(err);
      }
      // 如果快取中沒有這筆資料，會回傳 null
      if (!!data) {
        result = JSON.parse(data);
      }
    });

    return result;
  }

  /**
   * expireTime 沒填預設 15min / is_expired 預設 true
   * @param key string
   * @param result <T>
   * @param expireTime  number
   * @param is_expired boolean
   */
  async setCacheData(
    key: string,
    result,
    expireTime: number = null,
    is_expired = true //是否會過期
  ) {
    if (!this.client) {
      await this.client;
    }

    if (is_expired) {
      const expireDay = expireTime ? expireTime : 60 * 15; //15min

      await this.client.set(
        key,
        JSON.stringify(result),
        'EX',
        expireDay,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    } else {
      await this.client.set(key, JSON.stringify(result));
    }
  }

  /**
   * delete cache data by key
   * @param key string
   * @param isConsole boolean
   * @returns
   */
  async delCacheData(key: string) {
    if (!this.client) {
      await this.client;
    }
    await this.client.del(key);
  }

  /**
   * 取得 key 剩餘 ttl
   * @param key string
   * @returns
   */
  async getKeyTtl(key: string) {
    if (!this.client) {
      await this.client;
    }

    const result = await this.client.ttl(key);

    return result;
  }

  /**
   * s 端客戶登入後，將資料整理為 cacheUserInfo，儲存到 redis, 預設 15 分鐘
   * @param cacheUserInfo
   */
  async setCacheUserInfo(
    cacheUserInfo: CacheUserInfo,
    ttl: number = config.TTL.JWT_TOKEN
  ) {
    await this.setCacheData(
      `${config.REDIS_KEY.TOKEN}:${cacheUserInfo.token}`,
      cacheUserInfo,
      ttl
    );
  }

  async setRefreshToken(
    cacheUserInfo: CacheRefreshInfo,
    ttl: number = config.TTL.JWT_TOKEN
  ) {
    await this.setCacheData(
      `${config.REDIS_KEY.RFTOKEN}:${cacheUserInfo.token}`,
      cacheUserInfo,
      ttl
    );
  }

  /**
   * s 端客戶登入後，token 儲存到 redis, 預設 15 分鐘
   * @param act
   * @param token
   * @param ttl
   */
  async setCacheUserToken(
    act: string,
    token: string,
    ttl: number = config.TTL.JWT_TOKEN
  ) {
    await this.setCacheData(
      `${config.REDIS_KEY.TOKEN}:${act}:${token}`,
      token,
      ttl
    );
  }

  /**
   * 回傳當前登入的 c 端客戶 CacheUserInfo
   * @returns CacheUserInfo
   */
  async getUserInfoFromCache(token: string): Promise<CacheUserInfo> {
    const result: CacheUserInfo = await this.getCacheData(
      `${config.REDIS_KEY.TOKEN}:${token}`
    );

    if (!result) {
      throw new CustomerException(configError._200003, HttpStatus.FORBIDDEN);
    }

    // 延展
    await this.setCacheUserInfo(result);

    return result;
  }

  /**
   * 向右新增至列表
   *
   * @param key
   * @param result
   */
  async lpushData(key: string, result, ttl?: number) {
    if (!this.client) {
      await this.client;
    }

    await this.client.lpush(key, result, (err, result) => {
      // 設置 List 的過期時間
      if (ttl) this.client.expire(key, ttl);
    });
  }

  /**
   * 取最後一個列表值，並移除
   *
   * @param key
   * @returns
   */
  async rpopData(key: string): Promise<string> {
    if (!this.client) {
      await this.client;
    }

    const result = await this.client.rpop(key);

    return result;
  }

  /**
   * 查詢所有的key
   *
   * @returns
   */
  async scan(matchKey?: string) {
    if (!this.client) {
      await this.client;
    }

    let cursor = '0';
    let keys = [];

    do {
      let res;
      matchKey
        ? (res = await this.client.scan(cursor, 'MATCH', matchKey))
        : (res = await this.client.scan(cursor));

      cursor = res[0];
      keys = keys.concat(res[1]);
    } while (cursor !== '0');

    return keys;
  }
}
