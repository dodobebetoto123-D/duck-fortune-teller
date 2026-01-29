// server.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES Module 환경에서는 __dirname이 없어서 직접 만들어줘야 합니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API 엔드포인트
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
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const fortune = response.data.choices[0]?.message?.content?.trim();
    res.json({ fortune });
  } catch (e) {
    console.error('에러 상세:', e.response?.data || e.message);
    res.status(500).json({ error: '운세덕이 졸고 있어요 꽥!' });
  }
});

// 빌드된 리액트 파일 서빙
app.use(express.static(path.join(__dirname, 'dist')));

app.get('(.*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 꽥꽥 실행 중!`);
});