import { ApiProperty } from '@nestjs/swagger';

export class GetClusterCommonSettingResp {
  @ApiProperty({
    title: '主力會員 N 天內有消費',
    example: '1',
    description: '主力會員 N 天內有消費'
  })
  mainMemberConsumerDay: number;

  @ApiProperty({
    title: '瞌睡會員 N 天內有消費',
    example: '1',
    description: '瞌睡會員 N 天內有消費'
  })
  drowsyMemberConsumerDay: number;

  @ApiProperty({
    title: '瞌睡會員 N 天內無消費',
    example: '1',
    description: '瞌睡會員 N 天內無消費'
  })
  drowsyMemberNotConsumerDay: number;

  @ApiProperty({
    title: '沈睡會員 N 天內有消費',
    example: '1',
    description: '沈睡會員 N 天內有消費'
  })
  sleepyMemberConsumerDay: number;

  @ApiProperty({
    title: '沈睡會員 N 天內無消費',
    example: '1',
    description: '沈睡會員 N 天內無消費'
  })
  sleepyMemberNotConsumerDay: number;

  @ApiProperty({
    title: '流失會員 N 天內無消費',
    example: '1',
    description: '流失會員 N 天內無消費'
  })
  lostMemberNotConsumerDay: number;
}
