import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetMealPeriodListDto {
  @ApiProperty({
    title: '餐期id',
    example: '1',
    description: '流水號',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    title: '餐期代碼',
    example: 'BR',
    description: '餐期代碼',
    required: true,
  })
  @IsString()
  mealPeriodId: string;

  @ApiProperty({
    title: '餐期名稱',
    example: 'BR',
    description: '餐期代碼',
    required: true,
  })
  @IsString()
  mealPeriodName: string;

  @ApiProperty({
    title: '建立時間',
    example: '2023-07-14T02:18:12.000Z',
    description: '建立時間',
  })
  @IsBoolean()
  @IsOptional()
  createDate: boolean;

  @ApiProperty({
    title: '建立人員',
    example: 'Tommy',
    description: '建立人員',
  })
  @IsBoolean()
  @IsOptional()
  createName: boolean;

  @ApiProperty({
    title: '更新時間',
    example: '2023-07-14T02:18:12.000Z',
    description: '更新時間',
  })
  @IsBoolean()
  @IsOptional()
  alterDate: boolean;

  @ApiProperty({
    title: '更新人員',
    example: 'Tommy',
    description: '更新人員',
  })
  @IsBoolean()
  @IsOptional()
  alterName: boolean;
}
