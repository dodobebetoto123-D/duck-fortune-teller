// api/getSajuFortune.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 허용' });

  const token = process.env.HF_TOKEN;

  // 1. 토큰 없으면 바로 알려줌
  if (!token) {
    return res.status(500).json({ 
      error: 'HF_TOKEN 환경변수가 없어요! Vercel에 꼭 추가해주세요!' 
    });
  }

  const { birthDate } = req.body;
  if (!birthDate) return res.status(400).json({ error: '생년월일이 필요해요' });

  try {
    // 이 모델은 2025년 1월 기준 무료 계정에서도 거의 항상 켜져 있음!
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        inputs: `너는 귀여운 오리 점술가 "운세덕"이야! 생년월일: ${birthDate}\n오늘 운세를 150자 이내로 귀엽고 재미있게 말해줘. 마지막에 꼭 "꽥!" 붙여줘!`,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.85,
          top_p: 0.9,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      },
    );

    let fortune = response.data[0]?.generated_text?.trim();

    // 프롬프트 반복 제거
    if (fortune?.includes(birthDate)) {
      fortune = fortune.split('꽥!').pop()?.trim() || fortune;
    }

    fortune = fortune || '오늘은 모든 일이 잘 풀리는 날이야! 행운이 꽥꽥!';

    return res.status(200).json({ fortune });

  } catch (error: any) {
    // 진짜 에러 원인 보여주기 (이제 숨김 없음!)
    console.error('HuggingFace 실제 에러:', error.response?.data || error.message);

    // 모델 로딩 중일 때
    if (error.response?.data?.error?.includes('loading')) {
      return res.status(503).json({ 
        error: '운세덕이 지금 깨우는 중이야... 20~30초 후에 다시 눌러줘 꽥!' 
      });
    }

    // 토큰 문제일 때
    if (error.response?.status === 401) {
      return res.status(500).json({ 
        error: 'HF_TOKEN이 잘못됐어요! 다시 발급받아서 넣어주세요.' 
      });
    }

    // 그 외 모든 에러
    return res.status(500).json({ 
      error: '운세덕이 꽥 하고 놀랐나봐...',
      detail: error.response?.data || error.message
    });
  }
}