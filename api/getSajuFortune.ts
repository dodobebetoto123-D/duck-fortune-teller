import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 이거 3줄만 추가하면 405/OPTIONS 문제 완전 해결
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS preflight 필수 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST 아니면 바로 405
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const token = process.env.HF_TOKEN;
  if (!token) return res.status(500).json({ error: 'HF_TOKEN 없음' });

  const { birthDate } = req.body;
  if (!birthDate) return res.status(400).json({ error: '생일 없음' });

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
      {
        inputs: `너는 운세덕이야 꽥! ${birthDate} 오늘 운세 귀엽게 150자 이내로 말해줘! 마지막에 꽥!`,
        parameters: { max_new_tokens: 200, temperature: 0.85, return_full_text: false }
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000
      }
    );

    let fortune = response.data[0]?.generated_text?.trim() || "오늘은 꽝이야 꽥...";

    return res.status(200).json({ fortune });

  } catch (error: any) {
    console.error("HF error:", error.response?.data || error.message);
    
    if (error.response?.data?.error?.includes("loading")) {
      return res.status(503).json({ error: "운세덕이 깨우는 중이야 꽥... 30초 후 다시 시도해!" });
    }

    return res.status(500).json({ error: "운세덕이 꽥 하고 놀랐나봐..." });
  }
}