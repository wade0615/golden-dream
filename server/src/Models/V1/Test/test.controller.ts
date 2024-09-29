import { Controller, Get, HttpStatus, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import apiPath from 'src/Center/api.path';

// import { FirebaseRepository } from 'src/Providers/Database/Firestore/firebase.repository';
import { TestService } from './test.service';

import configError from 'src/Config/error.message.config';
import { CustomerException } from 'src/Global/ExceptionFilter/global.exception.handle.filter';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService // private firebaseRepository: FirebaseRepository
  ) {}

  /**
   * test punch me
   * @param body
   * @returns
   */
  @Get(apiPath.test.punchMe)
  async punchMe(@Req() req) {
    const result = {
      text: '打我啊笨蛋'
    };

    return result;
  }

  /**
   * 嘗試連結 firebase
   * @param req
   * @returns
   */
  // @Post(apiPath.test.getFireBase)
  // @UsePipes(GlobalDTOValidationPipe)
  // async getFireBase(@Req() req) {
  //   try {
  //     console.log('getFireBase service');
  //     // const testResult = await this.testDao.getFireBase();
  //     const testResult = await this.firebaseRepository.getFireBase();

  //     return testResult;
  //   } catch (error) {
  //     throw new CustomerException(configError._200002, HttpStatus.OK);
  //   }
  // }

  /**
   * 嘗試連接 mysql db
   * @param body
   * @returns
   */
  @Get(apiPath.test.getDB)
  async getDB(@Req() req) {
    try {
      console.log('getDB controller');
      const result = await this.testService.getDB();

      return result;
    } catch (error) {
      throw new CustomerException(configError._200002, HttpStatus.OK);
    }
  }
}
