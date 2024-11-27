import { Storage } from '@google-cloud/storage';
import { HttpStatus, Injectable } from '@nestjs/common';
// import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
// import { BELONG_TO } from 'src/Definition/Enum/code.center.belong.enum';
import {
  IMAGE_UPLOAD_TYPE,
  IMAGE_UPLOAD_TYPE_CONFIG
} from 'src/Definition/Enum/image.upload.type.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
// import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import { checkImageType, validateImage } from 'src/Utils/tools';
import { v4 as ruuidv4 } from 'uuid';
// import { GetTownshipCityDataResp } from './Dto/get.town.ship.city.data.dto';
import { UploadImageDto, UploadImageResp } from './Dto/upload.image.dto';
import { ImageUrlPath } from './Interface/image.url.path.interface';
import { CommonRepository } from './common.repository';
import moment = require('moment-timezone');

const fs = require('fs');
const storage = new Storage({
  projectId: process.env.GCP_PK_PROJECT_ID,
  scopes: process.env.GCP_PK_SCOPES,
  credentials: {
    private_key: process.env.GCP_PK_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GCP_PK_CLIENT_EMAIL
  }
});

@Injectable()
export class CommonService {
  constructor(
    private commonRepository: CommonRepository,
    // private readonly redisService: RedisService,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 更新 code center
   */
  // async updateCodeCenter(): Promise<{}> {
  //   await this.redisService.delCacheData(config.REDIS_KEY.CONFIG);
  //   const data = await this.commonRepository.getCodeCenterList();
  //   await this.redisService.setCacheData(
  //     config.REDIS_KEY.CONFIG,
  //     data,
  //     null,
  //     false
  //   );
  //   return {};
  // }

  /**
   * 取出鄉鎮市資料
   * @param req
   * @returns
   */
  // async getTownshipCityData(): Promise<GetTownshipCityDataResp> {
  //   // 快取取出鄉鎮市資料
  //   let townshipCache = await this.redisService.getCacheData(
  //     config.REDIS_KEY.CONFIG
  //   );

  //   // 娶不到快取資料，改從database取
  //   if (!townshipCache) {
  //     townshipCache = await this.commonRepository.getCodeCenterList();
  //     await this.redisService.setCacheData(
  //       config.REDIS_KEY.CONFIG,
  //       townshipCache,
  //       null,
  //       false
  //     );
  //   }

  //   // 市資料整理
  //   const township = townshipCache
  //     .filter((town) => town.belongTo === BELONG_TO.CITY_CODE)
  //     .map((town) => {
  //       return {
  //         cityCode: town.code,
  //         cityName: town.codeName,
  //         zips: []
  //       };
  //     });

  //   // 抓鄉鎮資料
  //   const townshipZip = townshipCache.filter(
  //     (town) => town.belongTo === BELONG_TO.ZIP_CODE
  //   );

  //   // 組合鄉鎮市
  //   township.forEach((city) => {
  //     townshipZip.forEach((zip) => {
  //       if (city.cityCode === zip.previousCode) {
  //         city.zips.push({
  //           zipCode: zip.code,
  //           zipName: zip.codeName
  //         });
  //       }
  //     });
  //   });

  //   return township;
  // }

  /**
   * 上傳圖片
   *
   * @param req
   * @param files
   * @returns
   */
  async uploadImage(
    req: UploadImageDto,
    files: Express.Multer.File[]
  ): Promise<UploadImageResp> {
    if (!req?.imageUploadType || !files.length) {
      throw new CustomerException(configError._200001, HttpStatus.OK);
    } else if (
      !Object.values(IMAGE_UPLOAD_TYPE).includes(req?.imageUploadType)
    ) {
      throw new CustomerException(configError._200001, HttpStatus.OK);
    }

    if (!checkImageType(files)) {
      throw new CustomerException(configError._310001, HttpStatus.OK);
    }

    // 檢查 count 是否符合圖檔上傳所選類型 (count 只能檔最大，實際儲存要再檢核)
    const imageUploadConfig = IMAGE_UPLOAD_TYPE_CONFIG[req?.imageUploadType];

    const isLengthValid = imageUploadConfig.count >= files.length;

    if (!isLengthValid) {
      throw new CustomerException(configError._310002, HttpStatus.OK);
    }

    // 檢查尺寸 & size
    await validateImage({
      files,
      maxHeight: imageUploadConfig?.height,
      maxWidth: imageUploadConfig?.width,
      maxMb: imageUploadConfig?.size
    });

    const uploadPath = imageUploadConfig?.path ?? '1';

    const res = await this.UploadImageToGS(files, 'image' + uploadPath);

    const result = <UploadImageResp>{};
    result.urls = res.map((file) => file.path);

    return result;
  }

  /**
   * 上傳圖片至 GS
   * @param files
   * @param type
   * @param name
   * @returns
   */
  async UploadImageToGS(
    files: Express.Multer.File[],
    fileSavePath: string,
    type?,
    name?
  ): Promise<ImageUrlPath[]> {
    if (!files) throw Error('no any task, please checking file upload.');

    let _extensions = [];
    let _names = [];
    //若沒傳進格式直接擷取圖片副檔名
    if (!type)
      _extensions = files.map((file) => {
        return file.mimetype.slice(
          file.mimetype.indexOf('/') + 1,
          file.mimetype.length
        );
      });
    //若沒傳圖片名稱直接產 uuid 當名稱
    if (!name)
      _names = files.map((file) => {
        return ruuidv4();
      });

    // write in local
    const dir = `${__dirname}/files`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const _imageFileLocalPaths = [];
    _extensions.forEach((_extension, extensionIndex) => {
      _names.forEach((name, nameIndex) => {
        if (extensionIndex === nameIndex) {
          _imageFileLocalPaths.push({
            name: `${name}.${_extension}`,
            localPath: `${dir}/${name}.${_extension}`
          });
        }
      });
    });

    const task = [];
    task.push(
      new Promise((rs, rj) => {
        _imageFileLocalPaths.map((_imageFileLocalPath, pathIndex) => {
          files.map((file, fileIndex) => {
            if (pathIndex === fileIndex) {
              fs.writeFile(
                _imageFileLocalPath.localPath,
                file.buffer,
                (err) => {
                  if (err) throw Error(err);
                  rs(null);
                }
              );
            }
          });
        });
      })
    );

    await Promise.all(task);

    // upload to gcp
    const imageUrlPath = await this.fileUploadToGS(
      _imageFileLocalPaths,
      fileSavePath,
      _extensions
    );

    return imageUrlPath;
  }

  /**
   *
   * @param _file 圖片
   * @param _fileSavePath 圖片存檔位置
   * @param _extension 圖片副檔名
   */
  async fileUploadToGS(
    _files,
    _fileSavePath,
    _extensions
  ): Promise<ImageUrlPath[]> {
    return new Promise(async (_rs, _rj) => {
      try {
        if (!_fileSavePath) _fileSavePath = 'image';
        // if (!_name) _name = ruuidv4();
        if (!_extensions) _extensions = this.getExtension(_files);

        const [buckets] = await storage.getBuckets();

        let bucketFolder: string;
        buckets.forEach((bucket) => {
          if (bucket.name.includes(process.env.GCP_PK_BUCKET_NAME)) {
            bucketFolder = bucket.name;
          }
        });

        const destinations = _files.map(async (file) => {
          return await storage
            .bucket(`${bucketFolder}`)
            .upload(file.localPath, {
              destination: `${_fileSavePath}/${file.name}`
            });
        });

        const result: ImageUrlPath[] = [];
        await Promise.all(destinations).then(async (destination) => {
          await destination.map((urls) => {
            if (urls && Array.isArray(urls)) {
              urls.forEach((url, urlIndex) => {
                if (url.metadata) {
                  return result.push({
                    index: urlIndex,
                    name: url.metadata.name.slice(
                      url.metadata.name.lastIndexOf('/') + 1
                    ),
                    path: url.metadata.mediaLink,
                    size: `${url.metadata.size} byte`
                  });
                }
              });
            }
          });
        });

        _rs(result);
      } catch (error) {
        // this.logService.printErrorELK(
        //   'GCPService.fileUploadToGS',
        //   'Service',
        //   ELK_LEVEL.ERROR,
        //   `[ERROR]: ${error.message}`,
        //   error.Code,
        //   'ing'
        // );
        _rj(error);
      }
    });
  }

  getExtension(_file) {
    const { mimetype } = _file;
    let result = '';
    if (mimetype) {
      switch (mimetype) {
        case 'image/gif':
          result = '.jpg';
          break;
        default:
      }
    }
    return result;
  }

  /**
   * 取得存在的 table
   * @param tableNames
   */
  // async getExistedTable(tableNames: string[]): Promise<string[]> {
  //   // 1. 先找 redis 是否有相符的 table
  //   // 2. 若 tableNames 有部分不存在在 result => 把沒有的整合在 notIncludeTable，送進資料庫問是否存在
  //   // 3. 整合原本的 result+newExistedTable 再丟進 redis update

  //   let result =
  //     (await this.redisService.getCacheData(
  //       config.REDIS_KEY.MEMBER_POINT_LOG
  //     )) ?? [];

  //   const notIncludeTable = tableNames.filter((t) => !result.includes(t));

  //   if (notIncludeTable?.length) {
  //     const newExistedTable =
  //       (await this.commonRepository.getExistedTable(notIncludeTable)) ?? [];

  //     // 整合原本的 result+newExistedTable
  //     result = result.concat(newExistedTable);

  //     // 放一天
  //     this.redisService.setCacheData(
  //       config.REDIS_KEY.MEMBER_POINT_LOG,
  //       result,
  //       60 * 60 * 24
  //     );
  //   }

  //   return result;
  // }

  /**
   * 取得左邊卡片資訊
   * @returns
   */
  async getAsideCardDetail(): Promise<{
    postCount: number;
    categoriesCount: number;
  }> {
    try {
      const data = await this.commonRepository.getAsideCardDetail();

      return data;
    } catch (error) {
      console.error('getAsideCardDetail service error:', error);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
