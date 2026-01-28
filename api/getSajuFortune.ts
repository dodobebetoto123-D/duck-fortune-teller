// api/getSajuFortune.ts (또는 .js)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    return response.status(500).json({ 
      error: 'HF_TOKEN이 설정되지 않았습니다! Vercel에 환경변수 추가해주세요.' 
    });
  }

  const { birthDate } = request.body;
  if (!birthDate) {
    return response.status(400).json({ error: 'birthDate가 필요합니다.' });
  }

  const prompt = `너는 귀엽고 재치 있는 오리 점술가 "운세덕"이야!
생년월일: ${birthDate}

사주 운세를 재미있고 현대적으로 풀어줘. 
200자 이내로, 한국어로, 항상 친근한 말투로 쓰고 마지막에 "꽥!" 붙여줘!`;

  try {
    // 이 모델은 무료로 항상 켜져 있어요! (2025년 1월 기준)
    const model = "mistralai/Mistral-7B-Instruct-v0.3";

    const apiResponse = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.8,
          top_p: 0.9,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30초 타임아웃
      },
    );

    let fortune = apiResponse.data[0]?.generated_text?.trim();

    // 만약 모델이 inputs를 반복했다면 제거
    if (fortune.startsWith(prompt)) {
      fortune = fortune.replace(prompt, '').trim();
    }

    // 빈 응답 방지
    if (!fortune) fortune = "오늘은 운세덕이 너무 졸려서... 내일 다시 와줘 꽥!";

    return response.status(200).json({ fortune });

  } catch (error: any) {
    console.error('HF API Error:', error.message);

    // 모델 로딩 중일 때
    if (error.response?.data?.error?.includes('loading')) {
      return response.status(503).json({ 
        error: '운세덕이 지금 잠에서 깨고 있어... 30초 후에 다시 시도해줘 꽥!' 
      });
    }

    return response.status(500).json({ 
      error: '운세덕이 꽥꽥대느라 정신없나봐... 다시 시도해줘!' 
    });
  }
}