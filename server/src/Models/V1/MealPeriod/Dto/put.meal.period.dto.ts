import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class UpdMealPeriodDto {
  @ApiProperty({
    title: '餐期id',
    example: '1',
    description: '流水號'
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    title: '餐期代碼',
    example: 'BR',
    description: '餐期代碼',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  mealPeriodId: string;

  @ApiProperty({
    title: '餐期名稱',
    example: '早餐',
    description: '',
    required: true
  })
  @IsString()
  @IsOptional()
  mealPeriodName: string;
}

export class DelMealPeriodDto {
  @ApiProperty({
    title: '餐期id',
    example: '1',
    description: '流水號'
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class SortMealPeriodDto {
  @ApiProperty({
    title: '餐期順序',
    examples: ['BA', 'BB'],
    description: '透過id陣列做餐期排序',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  listSorts: string[];
}
