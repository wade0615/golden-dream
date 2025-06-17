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
      回覆格式: {"isAboutTaiwan": true/false}
    `;

    const response = await this.client.responses.create({
      model: 'gpt-4o',
      input: prompt
    });

    // console.log('OpenAI Response:', response?.output_text);

    // 無論我拿到 {"isAboutTaiwan": false} 還是 ```json\n{"isAboutTaiwan": false}\n```
    // 都要轉換成 JSON 格式的 {"isAboutTaiwan": false}
    // 這裡假設 response?.output_text 是一個 JSON 字符串
    if (!response?.output_text) {
      throw new Error('OpenAI response is empty or undefined');
    }
    // 嘗試解析 JSON 字符串
    // 如果 response?.output_text 是一個 JSON 字符串，則直接解析
    // 如果 response?.output_text 是一個非標準格式的字符串，則需要進行處理
    if (response?.output_text.startsWith('```json\n')) {
      // 去除開頭的 ```json\n 和結尾的 \n```
      response.output_text = response.output_text
        .replace(/^```json\n/, '')
        .replace(/\n```$/, '');
    } else if (response?.output_text.startsWith('```')) {
      // 去除開頭的 ``` 和結尾的 ```
      response.output_text = response.output_text
        .replace(/^```/, '')
        .replace(/```$/, '');
    } else {
      // 如果是標準的 JSON 格式，則不需要處理
    }
    const result = JSON.parse(response?.output_text);

    return {
      isAboutTaiwan: result?.isAboutTaiwan || false
    };
  }
}
