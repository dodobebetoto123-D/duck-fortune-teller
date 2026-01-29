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
  // 1. 키 이름이 OPENROUTER_API_KEY가 맞는지, Railway에 등록했는지 꼭 확인!
  const token = process.env.OPENROUTER_API_KEY;
  const { birthDate } = req.body;

  console.log("요청 받은 생일:", birthDate); // 서버 로그 확인용

  if (!token) {
    console.error("에러: OPENROUTER_API_KEY가 설정되지 않았습니다.");
    return res.status(500).json({ error: '서버 API 키 설정 오류' });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'tngtech/deepseek-r1t2-chimera:free',
        messages: [{
          role: 'user',
          content: `오리 점술가 운세덕이다 꽥! ${birthDate} 생일의 오늘 운세를 귀엽게 120자 이내로 말해줘! 마지막에 꽥!`
        }],
        temperature: 0.7 // 너무 높으면 이상한 소리를 할 수 있어 0.7 권장
      },
      {
        headers: {
          'Authorization': `Bearer ${token.trim()}`, // 혹시 모를 공백 제거
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://railway.app', // OpenRouter 필수 권장 헤더
          'X-Title': 'DuckFortune'                // OpenRouter 필수 권장 헤더
        }
      }
    );

    // 2. 데이터 추출 시 안전장치 추가
    if (response.data && response.data.choices && response.data.choices[0]) {
      const fortune = response.data.choices[0].message.content.trim();
      res.json({ fortune });
    } else {
      throw new Error("OpenRouter 응답 형식이 올바르지 않습니다.");
    }

  } catch (e) {
    // 3. 에러 내용을 구체적으로 출력 (Railway Logs에서 확인 가능)
    console.error('OpenRouter 통신 에러 상세:', e.response?.data || e.message);
    res.status(500).json({
      error: '운세덕이 심오한 생각에 빠졌어 꽥!',
      details: e.response?.data?.error?.message || e.message
    });
  }
});

// 빌드된 리액트 파일 서빙
app.use(express.static(path.join(__dirname, 'dist')));

app.get(/^((?!\/api).)*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 꽥꽥 실행 중!`);
});