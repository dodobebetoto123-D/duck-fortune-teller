import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. API 엔드포인트 설정
app.post('/api/getSajuFortune', async (req, res) => {
  const token = process.env.OPENROUTER_API_KEY;
  const { birthDate } = req.body;

  if (!token) return res.status(500).json({ error: 'API 키가 없습니다.' });

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'tngtech/deepseek-r1t2-chimera:free',
        messages: [{
          role: 'user',
          content: `오리 점술가 운세덕이다 꽥! ${birthDate} 생일의 오늘 운세를 귀엽게 120자 이내로 말해줘! 마지막에 꽥!`
        }],
        temperature: 0.9
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const fortune = response.data.choices[0]?.message?.content?.trim();
    res.json({ fortune });
  } catch (e) {
    res.status(500).json({ error: '운세덕이 졸고 있어요 꽥!' });
  }
});

// 2. 리액트 빌드 파일 서빙 (Railway 배포용)
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다! 🦆`);
});