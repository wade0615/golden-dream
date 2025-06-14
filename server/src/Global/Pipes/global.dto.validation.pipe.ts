import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import configError from 'src/Config/error.message.config';
import { CustomerException } from '../ExceptionFilter/global.exception.handle.filter';

/**
 * 全域 DTO 驗證 Pipe
 * 用於驗證傳入的 DTO 是否符合定義的類型和約束
 * 如果驗證失敗，則拋出自定義的 CustomerException
 * @example
 * @Global()
 * @UsePipes(new GlobalDTOValidationPipe())
 * export class AppController {
 *   @Get()
 *   getHello(@Body() body: CreateDto): string {
 *     return `Hello ${body.name}`;
 *   }
 * }
 */
@Injectable()
export class GlobalDTOValidationPipe implements PipeTransform<any> {
  async transform(value, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new CustomerException(
        {
          ...configError._200001,
          additional: { msg: JSON.stringify(errors), isHide: true }
        },
        HttpStatus.OK
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}

export class GlobalParseArrayPipe implements PipeTransform {
  private readonly metatype;

  constructor(options: any) {
    this.metatype = options.type;
  }

  async transform(items: any) {
    if (!items?.length)
      throw new CustomerException(configError._200001, HttpStatus.OK);

    return await Promise.all(
      items.map(async (item) => {
        return await this.parseAndValidate(item);
      })
    );
  }

  async parseAndValidate(value: any) {
    return new Promise(async (rs, rj) => {
      try {
        switch (this.metatype) {
          case String:
            if (typeof value !== 'string')
              throw new CustomerException(configError._200001, HttpStatus.OK);
            rs(value);
          default:
            if (!this.metatype || !this.toValidate(this.metatype)) {
              return value;
            }
            const object = plainToClass(this.metatype, value);
            const errors = await validate(object);
            if (errors.length > 0) {
              throw new CustomerException(
                {
                  ...configError._200001,
                  additional: { msg: JSON.stringify(errors), isHide: true }
                },
                HttpStatus.OK
              );
            }
            rs(value);
            break;
        }
      } catch (error) {
        rj(error);
      }
    });
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
