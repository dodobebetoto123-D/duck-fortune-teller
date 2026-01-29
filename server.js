// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. 기존 getSajuFortune.ts의 로직을 여기로 가져왔습니다.
app.post('/api/getSajuFortune', async (req, res) => {
  const token = process.env.OPENROUTER_API_KEY; // Railway 환경변수
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
    console.error(e);
    res.status(500).json({ error: '운세덕이 졸고 있어요 꽥!' });
  }
});

// 2. 리액트 빌드 파일(dist 폴더)을 서버가 직접 보여주게 합니다.
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 꽥꽥 실행 중!`);
});