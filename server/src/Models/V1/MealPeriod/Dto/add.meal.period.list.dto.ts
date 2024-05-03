import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddMealPeriodDto {
  @ApiProperty({
    title: '餐期代碼',
    example: 'BR',
    description: '餐期代碼',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  mealPeriodId: string;

  @ApiProperty({
    title: '餐期名稱',
    example: '早餐',
    description: '',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  mealPeriodName: string;
}
