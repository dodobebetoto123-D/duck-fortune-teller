import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Allow requests from our Firebase app
  response.setHeader('Access-Control-Allow-Origin', 'https://duck-fortune-teller.web.app');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight CORS request
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (!openRouterKey) {
    return response.status(500).json({ error: 'API key is not configured.' });
  }

  const { birthDate } = request.body;

  if (!birthDate) {
    return response.status(400).json({ error: "The function must be called with one argument 'birthDate'." });
  }

  const prompt = `
    You are a wise and witty fortune-telling duck.
    Your name is "운세덕".
    You are giving a traditional Saju reading, but with a fun and modern twist.
    Keep the response in Korean, be concise (under 200 characters), and always speak in a friendly, duck-like tone, maybe add a "꽥!"(quack!) at the end.

    Analyze the following birth information, which may or may not include a specific time. If the time is unknown (indicated by "시간 모름"), consider giving a slightly more general fortune that focuses on the day.
    Birth information: ${birthDate}
  `;

  try {
    const apiResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'tngtech/deepseek-r1t2-chimera:free',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const fortune = apiResponse.data.choices[0].message.content;
    return response.status(200).json({ fortune });
  } catch (error: any) {
    console.error('Error calling OpenRouter API:', error.response?.data);
    return response.status(500).json({ error: 'Failed to get fortune from AI.' });
  }
}
