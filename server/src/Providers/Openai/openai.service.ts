import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async processNewsContent(
    content: string
  ): Promise<{ isAboutTaiwan: boolean }> {
    const prompt = `
    判斷以下敘述是否與「台灣」「台海危機」「台灣與中國戰爭」「台灣周邊議題」有關，
    敘述: "${content}"。
    回覆格式: {isAboutTaiwan: true/false}`;

    const response = await this.client.responses.create({
      model: 'gpt-4',
      input: prompt
      // response_format: {
      //   type: 'json',
      //   properties: {
      //     isAboutTaiwan: {
      //       type: 'boolean',
      //       description: '是否與台灣相關',
      //       example: 'true',
      //       enum: ['true', 'false']
      //     }
      //   }
      // },
      // max_tokens: 500
    });

    console.log('OpenAI Response:', response);
    const result = response;
    return {
      isAboutTaiwan: true
    };
  }
}
