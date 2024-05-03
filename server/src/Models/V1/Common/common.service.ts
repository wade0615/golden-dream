import { Storage } from '@google-cloud/storage';
import { HttpStatus, Injectable } from '@nestjs/common';
import config from 'src/Config/config';
import configError from 'src/Config/error.message.config';
import {
  CSV_ACTION,
  CSV_TEMP_TABLE_COLUMN_NAME,
  CSV_TEMP_TABLE_COLUMN_SCHEMA
} from 'src/Definition/Enum/Common/import.csv.data.enum';
import { CSV_FILE_EXTENSIONS } from 'src/Definition/Enum/Member/file.extension.enum';
import { BELONG_TO } from 'src/Definition/Enum/code.center.belong.enum';
import {
  IMAGE_UPLOAD_TYPE,
  IMAGE_UPLOAD_TYPE_CONFIG
} from 'src/Definition/Enum/image.upload.type.enum';
import {
  ENUM_INSERT_EXPORT_EVENT,
  ENUM_INSERT_EXPORT_EVENT_STR
} from 'src/Definition/Enum/insert.export.event.enum';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';
import { MysqlProvider } from 'src/Providers/Database/DatabaseMysql/mysql.provider';
import { RedisService } from 'src/Providers/Database/Redis/redis.service';
import csvToJson from 'src/Utils/csvToJson';
import {
  checkImageType,
  generateSerialNumber,
  removeFirstZero,
  secondsUntilEndOfDay,
  validateImage
} from 'src/Utils/tools';
import { v4 as ruuidv4 } from 'uuid';
import { MemberRepository } from '../Member/member.repository';
import { TagRepository } from '../Tag/tag.repository';
import { CheckMobileIsExistedDto } from './Dto/check.mobile.is.existed.dto';
import { ExportCsvDataDto } from './Dto/export.csv.data.dto';
import { GetTownshipCityDataResp } from './Dto/get.town.ship.city.data.dto';
import { UploadExcelResp } from './Dto/upload.excel.dto';
import { UploadImageDto, UploadImageResp } from './Dto/upload.image.dto';
import { ImageUrlPath } from './Interface/image.url.path.interface';
import {
  ImportCsvDataReq,
  ImportCsvDataResp
} from './Interface/import.csv.data.interface';
import { InsImportCsvDataReq } from './Interface/ins.import.csv.data.interface';
import { CommonRepository } from './common.repository';
import moment = require('moment-timezone');

const fs = require('fs');
const storage = new Storage({
  projectId: process.env.GCP_PK_PROJECT_ID,
  scopes: process.env.GCP_PK_SCOPES,
  credentials: {
    private_key: process.env.GCP_PK_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GCP_PK_CLIENT_EMAIL
  }
});

@Injectable()
export class CommonService {
  constructor(
    private commonRepository: CommonRepository,
    private memberRepository: MemberRepository,
    private tagRepository: TagRepository,
    private readonly redisService: RedisService,
    private internalConn: MysqlProvider
  ) {}

  /**
   * 更新 code center
   */
  async updateCodeCenter(): Promise<{}> {
    await this.redisService.delCacheData(config.REDIS_KEY.CONFIG);
    const data = await this.commonRepository.getCodeCenterList();
    await this.redisService.setCacheData(
      config.REDIS_KEY.CONFIG,
      data,
      null,
      false
    );
    return {};
  }

  /**
   * 取出鄉鎮市資料
   * @param req
   * @returns
   */
  async getTownshipCityData(): Promise<GetTownshipCityDataResp> {
    // 快取取出鄉鎮市資料
    let townshipCache = await this.redisService.getCacheData(
      config.REDIS_KEY.CONFIG
    );

    // 娶不到快取資料，改從database取
    if (!townshipCache) {
      townshipCache = await this.commonRepository.getCodeCenterList();
      await this.redisService.setCacheData(
        config.REDIS_KEY.CONFIG,
        townshipCache,
        null,
        false
      );
    }

    // 市資料整理
    const township = townshipCache
      .filter((town) => town.belongTo === BELONG_TO.CITY_CODE)
      .map((town) => {
        return {
          cityCode: town.code,
          cityName: town.codeName,
          zips: []
        };
      });

    // 抓鄉鎮資料
    const townshipZip = townshipCache.filter(
      (town) => town.belongTo === BELONG_TO.ZIP_CODE
    );

    // 組合鄉鎮市
    township.forEach((city) => {
      townshipZip.forEach((zip) => {
        if (city.cityCode === zip.previousCode) {
          city.zips.push({
            zipCode: zip.code,
            zipName: zip.codeName
          });
        }
      });
    });

    return township;
  }

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
   * 上傳 Excel
   *
   * @param dir
   * @param fileName
   * @param fileSavePath
   * @returns
   */
  async uploadExcel(
    dir: string,
    fileName: string,
    fileSavePath = 'excel'
  ): Promise<UploadExcelResp> {
    const files = [{ name: fileName, localPath: `${dir}/${fileName}` }];

    const urlPath = await this.fileUploadToGS(files, fileSavePath, '');

    const result = <UploadImageResp>{};
    result.urls = urlPath.map((file) => file.path);
    console.log(result);

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
   * 檢查電話號碼是否存在
   * @param req
   */
  async checkMobileIsExisted(
    req: CheckMobileIsExistedDto
  ): Promise<Record<string, never>> {
    const isExisted = await this.memberRepository.getMemberDetailByMobile(
      req?.mobileContryCode,
      removeFirstZero(req?.mobile)
    );

    if (!isExisted)
      throw new CustomerException(configError._380001, HttpStatus.OK);

    return {};
  }

  /**
   * 取得存在的 table
   * @param tableNames
   */
  async getExistedTable(tableNames: string[]): Promise<string[]> {
    // 1. 先找 redis 是否有相符的 table
    // 2. 若 tableNames 有部分不存在在 result => 把沒有的整合在 notIncludeTable，送進資料庫問是否存在
    // 3. 整合原本的 result+newExistedTable 再丟進 redis update

    let result =
      (await this.redisService.getCacheData(
        config.REDIS_KEY.MEMBER_POINT_LOG
      )) ?? [];

    const notIncludeTable = tableNames.filter((t) => !result.includes(t));

    if (notIncludeTable?.length) {
      const newExistedTable =
        (await this.commonRepository.getExistedTable(notIncludeTable)) ?? [];

      // 整合原本的 result+newExistedTable
      result = result.concat(newExistedTable);

      // 放一天
      this.redisService.setCacheData(
        config.REDIS_KEY.MEMBER_POINT_LOG,
        result,
        60 * 60 * 24
      );
    }

    return result;
  }

  /**
   * 新增匯出事件至 DB
   * @param csvType 匯出類型
   * @param memberId 點擊的會員
   * @param fileName csv檔案名稱【】 裡的字串
   * @param reqJson 生成資料需要的 req
   */
  async insertExportEvent(
    csvType: string,
    memberId: string,
    fileName: string,
    reqJson: string
  ): Promise<{ id: string; totalFileName: string }> {
    const id = await this.createExportId();
    const today = moment().tz(process.env.TIME_ZONE).format('YYYYMMDD');
    const totalFileName = `${fileName}${today}-${id}`;
    await this.commonRepository.insertExportEvent(
      id,
      csvType,
      memberId,
      totalFileName,
      reqJson
    );

    return {
      id,
      totalFileName
    };
  }

  /**
   * 創建 匯出 ID
   * @param date
   * @returns
   */
  async createExportId(): Promise<string> {
    let nextId;
    const date = moment().tz(process.env.TIME_ZONE).format('YYMMDD');
    const redisKey = `${config.REDIS_KEY.MAX_EXPORT_ID}:${date}`;
    nextId = await this.redisService.rpopData(redisKey);
    if (nextId) return nextId;

    const prefix = `EX${date}`;
    const maxId = await this.commonRepository.getMaxExportId();

    let seq = 1;
    if (maxId) {
      const maxDate = maxId.substring(2, 8);
      if (date === maxDate) {
        seq = Number(maxId.substring(8, 12));
      }
    }
    const risIds: string[] = generateSerialNumber(prefix, seq, 4);
    await this.redisService.lpushData(redisKey, risIds, secondsUntilEndOfDay());

    nextId = await this.redisService.rpopData(redisKey);

    return nextId;
  }

  /**
   * 匯入 Csv 資料
   *
   * @param req
   * @returns
   */
  async importCsvData(
    file: Express.Multer.File,
    req: ImportCsvDataReq
  ): Promise<ImportCsvDataResp> {
    if (!file?.originalname) {
      throw new CustomerException(configError._220021, HttpStatus.OK);
    }

    const extension = file?.originalname.split('.').pop();
    if (!CSV_FILE_EXTENSIONS.includes(extension)) {
      throw new CustomerException(configError._220020, HttpStatus.OK);
    }

    const { buffer } = file;

    const dir = `${__dirname}/member`;
    const fileName = 'temp.csv';
    const csvPath = `${dir}/${fileName}`;
    // 指定位置
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(csvPath, buffer, 'utf8');

    const fileContent = fs.readFileSync(csvPath, 'utf8');
    if (fileContent?.length <= 0) {
      throw new CustomerException(configError._220007, HttpStatus.OK);
    }

    const content = fileContent.split('\r\n');

    const uid = ruuidv4().split('-');
    const tableName = `Upload_Csv_${uid[0]}_${uid[1]}`;

    const insImportCsvDataReq = <InsImportCsvDataReq>{
      columnDetails: [],
      insColumns: [],
      insValue: []
    };
    insImportCsvDataReq.tableName = tableName;

    switch (req?.action) {
      case CSV_ACTION.MOBILE:
        insImportCsvDataReq.columnDetails.push(
          CSV_TEMP_TABLE_COLUMN_SCHEMA.MOBILE_COUNTRY_CODE,
          CSV_TEMP_TABLE_COLUMN_SCHEMA.MOBILE
        );
        insImportCsvDataReq.insColumns.push(
          CSV_TEMP_TABLE_COLUMN_NAME.MOBILE_COUNTRY_CODE,
          CSV_TEMP_TABLE_COLUMN_NAME.MOBILE
        );

        let i = 0;
        for (const str of content) {
          i++;

          const val = str.split(',');
          if (val[0] == '' || val[1] == '' || i == 1) {
            continue;
          }

          const _mobileCountryCode = this.internalConn.escape(`+${val[0]}`);
          const _mobile = this.internalConn.escape(val[1]);

          insImportCsvDataReq.insValue.push(
            `(${_mobileCountryCode}, ${_mobile})`
          );
        }

        break;
      default:
        throw new CustomerException(configError._220021, HttpStatus.OK);
    }

    if (!insImportCsvDataReq?.insValue?.length) {
      throw new CustomerException(configError._220022, HttpStatus.OK);
    }

    await this.commonRepository.insImportCsvData(insImportCsvDataReq);

    const ttl = req?.ttl ? req?.ttl : 20000;
    setTimeout(async () => {
      await this.commonRepository.dropImportCsvTempTable(tableName);
      // 刪除實體檔案
      fs.rmSync(csvPath, { recursive: true });
    }, ttl);

    const importCsvDataResp = <ImportCsvDataResp>{};
    importCsvDataResp.tempId = tableName;

    return importCsvDataResp;
  }

  /**
   * 匯出 Csv 資料
   *
   * @param req
   */
  async exportCsvData(req: ExportCsvDataDto): Promise<Record<string, never>> {
    const id = await this.createExportId();
    const today = moment().tz(process.env.TIME_ZONE).format('YYYYMMDD');

    let exportName = ENUM_INSERT_EXPORT_EVENT_STR[req?.action] ?? '';
    switch (req?.action) {
      case ENUM_INSERT_EXPORT_EVENT.MEMBER_TAG:
        const tagDetail = await this.tagRepository.getTagDetail(
          req?.params?.tagId
        );

        exportName = tagDetail?.tagName ?? '';
        break;
    }

    await this.commonRepository.insertExportEvent(
      id,
      req?.action,
      req?.iam?.authMemberId,
      `【${exportName}】${today}-${id}`,
      JSON.stringify(req?.params)
    );

    return {};
  }

  /**
   * 匯入通知
   * @param file
   */
  async importNotification(file: Express.Multer.File): Promise<{ id: string }> {
    const sendId = `${ruuidv4()}-${new Date().getTime().toString().slice(-5)}`;

    const { buffer } = file;
    const dir = `${__dirname}/files`;
    const fileName = 'importNotification.csv';
    const csvPath = `${dir}/${fileName}`;
    // 指定位置
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(csvPath, buffer, 'utf8');

    const connection = await this.internalConn.getConnection();

    try {
      await connection.beginTransaction();
      const data = await csvToJson(csvPath, true);
      await this.commonRepository.insert(connection, data, sendId);
      //刪除本地檔案
      fs.unlinkSync(csvPath);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new CustomerException(
        {
          code: configError._200002.code,
          msg: typeof error === 'string' ? error : configError._200002.msg
        },
        HttpStatus.OK
      );
    } finally {
      await connection.release();
    }

    // 產資料：
    // 設定 CSV 檔案的名稱和欄位名稱
    // const csvFileName = 'data.csv';
    // const columns = [
    //   'source',
    //   'type',
    //   'method',
    //   'title',
    //   'content',
    //   'email',
    //   'mobile'
    // ];

    // // 生成資料
    // const data1 = Array.from({ length: 5000 }, (_, index) => ({
    //   source: 'CRM',
    //   type: 'register',
    //   method: 'email',
    //   title: '通知中心測試',
    //   content: `測試-${index}`,
    //   email: 'silvia_wu@17life.com',
    //   mobile: '0937625117'
    // }));

    // // 將欄位名稱寫入檔案
    // let csvContent = `${columns.join(',')}\n`;

    // // 將資料轉換成 CSV 格式並寫入檔案
    // data1.forEach((item) => {
    //   csvContent += `${item.source},${item.type},${item.method},${item.title},${item.content},${item.email},${item.mobile}\n`;
    // });

    // const dir = `${__dirname}/files`;
    // const csvPath = `${dir}/${csvFileName}`;
    // // 指定位置
    // if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    // // 將 CSV 寫入檔案
    // fs.writeFileSync(csvPath, csvContent);

    return { id: sendId };
  }
}
