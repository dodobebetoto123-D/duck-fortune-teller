import axios from 'axios';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: any, res: any) {
  // 이 4줄이 Railway에서 생명줄임 (원본 유지)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 허깅페이스 토큰 대신 OpenRouter API 키 사용
  const token = process.env.OPENROUTER_API_KEY; 
  if (!token) return res.status(500).json({ error: '토큰 없음' });

  // 프론트에서 보낸 birthDate (날짜 + 시간 조합된 문자열)를 받음
  const { birthDate } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'tngtech/deepseek-r1t2-chimera:free',
        messages: [
          {
            role: 'user',
            // 원본 프롬프트 스타일을 최대한 유지
            content: `오리 점술가 운세덕이다 꽥! ${birthDate} 생일의 오늘 운세를 귀엽게 120자 이내로 말해줘! 마지막에 꽥!`
          }
        ],
        temperature: 0.9,
        max_tokens: 150
      },
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    // OpenRouter 응답 구조에 맞게 데이터 추출
    const fortune = response.data.choices[0]?.message?.content?.trim() || "오늘은 대박날 거야 꽥!";

    return res.status(200).json({ fortune });
  } catch (e: any) {
    console.error('에러 발생:', e.response?.data || e.message);
    return res.status(500).json({ error: "운세덕이 졸고 있나봐 꽥..." });
  }
}