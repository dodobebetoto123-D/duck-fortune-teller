import type { VercelRequest, VercelResponse } from '@vercel/node';

const MODEL = "mistralai/Mistral-7B-Instruct-v0.3";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  // api/getSajuFortune.ts 맨 위에서
  const token = process.env.HUGGINGFACE_TOKEN;   // ← 이걸로 바꿔
  // const token = process.env.HF_TOKEN;        // 이건 주석처리

  if (!token) return res.status(500).json({ error: "HF_TOKEN 없음" });

  const { birthDate } = req.body;
  if (!birthDate) return res.status(400).json({ error: "생일 없음" });

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `오리 점술가 운세덕이야! 생일: ${birthDate}\n오늘 운세 120자 이내로 귀엽게 말해줘 꽥!`,
        parameters: { max_new_tokens: 150, temperature: 0.8, return_full_text: false }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("HF 응답 에러:", err);
      return res.status(500).json({ error: "모델 깨우는 중", detail: err });
    }

    const data = await response.json();
    const fortune = data[0]?.generated_text?.trim() || "오늘 대박날 거야 꽥!";

    return res.status(200).json({ fortune });

  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
  if (!token) {
    return res.status(500).json({ error: "HUGGINGFACE_TOKEN 없음 ㅋ" });
  }
}
