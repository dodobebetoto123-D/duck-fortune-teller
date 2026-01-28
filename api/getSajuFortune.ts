// FORCE NEW DEPLOY 2025-01-14 88:88:88
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 이 줄이 보이면 새 코드 올라간 거다
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.HUGGINGFACE_TOKEN || process.env.HF_TOKEN;
  
  // 여기서 진짜 토큰 있으면 이 메시지 뜸
  if (!token) {
    return res.status(500).json({ error: "토큰 진짜 없음. 환경변수 이름 확인해" });
  }

  if (req.method !== 'POST') return res.status(405).end();

  const { birthDate } = req.body;
  if (!birthDate) return res.status(400).json({ error: "생일 없음" });

  return res.status(200).json({ 
    fortune: `운세덕이 깨어났다 꽥! 토큰 잘 읽힘! 생일: ${birthDate} 토큰 앞 10자: ${token.substring(0,10)}...` 
  });
}