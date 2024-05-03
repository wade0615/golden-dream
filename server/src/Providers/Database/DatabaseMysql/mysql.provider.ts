import { HttpStatus, Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { ConfigMysqlService } from 'src/Config/Database/Mysql/config.service';
import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

@Injectable()
export class MysqlProvider {
  private pool: mysql.Pool;

  constructor(private readonly crmDBConfigService: ConfigMysqlService) {
    this.pool = mysql.createPool({
      user: this.crmDBConfigService.username,
      password: this.crmDBConfigService.password,
      host: this.crmDBConfigService.host,
      database: crmDBConfigService.database,
      multipleStatements: true,
      port: crmDBConfigService.port,
      connectionLimit: 20,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      timezone: '+00:00',
      typeCast: function castField(field, useDefaultTypeCasting) {
        // We only want to cast bit fields that have a single-bit in them. If the field
        // has more than one bit, then we cannot assume it is supposed to be a Boolean.
        if (field.type === 'BIT' && field.length === 1) {
          var bytes = field.buffer();

          // A Buffer in Node represents a collection of 8-bit unsigned integers.
          // Therefore, our single "bit field" comes back as the bits '0000 0001',
          // which is equivalent to the number 1.
          return bytes?.[0] === 1;
        }

        return useDefaultTypeCasting();
      }
    });
  }

  async getConnection(): Promise<mysql.PoolConnection> {
    try {
      return this.pool.getConnection();
    } catch (err) {
      console.log(err);
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }

  releaseConnection(connection: mysql.PoolConnection): void {
    connection.release();
  }

  async query(sqlStr: string, values?: any[]): Promise<any> {
    const connection = await this.getConnection();
    try {
      await connection.beginTransaction();
      const result = await connection.query(sqlStr, values);
      await connection.commit();

      return result?.[0];
    } catch (err) {
      await connection.rollback();
      throw new CustomerException(
        {
          ...configError._200002,
          additional: { msg: err.message, isHide: true }
        },
        HttpStatus.OK
      );
    } finally {
      connection.release();
    }
  }

  // 使用connection的query
  async transactionQuery(
    connection: mysql.PoolConnection,
    sqlStr: string,
    values?: any[]
  ): Promise<any> {
    const result = await connection.query(sqlStr, values);

    return result?.[0];
  }

  escape(value: any): string {
    return mysql.escape(value);
  }

  escapeId(value: string): string {
    return mysql.escapeId(value);
  }
}
