import axios from 'axios';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: any, res: any) {
  // 이 4줄이 Railway에서 생명줄임
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = process.env.HF_TOKEN;
  if (!token) return res.status(500).json({ error: '토큰 없음' });

  const { birthDate } = req.body;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        inputs: `오리 점술가 운세덕이다 꽥! ${birthDate} 생일의 오늘 운세를 귀엽게 120자 이내로 말해줘! 마지막에 꽥!`,
        parameters: { max_new_tokens: 150, temperature: 0.9, return_full_text: false }
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const fortune = response.data[0]?.generated_text?.trim() || "오늘은 대박날 거야 꽥!";

    return res.status(200).json({ fortune });
  } catch (e) {
    return res.status(500).json({ error: "운세덕이 졸고 있나봐 꽥..." });
  }
}