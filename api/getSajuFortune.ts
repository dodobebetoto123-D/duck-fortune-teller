import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Allow requests from our Firebase app
  response.setHeader('Access-Control-Allow-Origin', '*'); // Temporarily allow all origins for local development
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight CORS request
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const hfToken = process.env.HF_TOKEN;

  if (!hfToken) {
    return response.status(500).json({ error: 'Hugging Face API key is not configured. Please set the HF_TOKEN environment variable.' });
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
    const model = "google/gemma-2b-it";
    const apiResponse = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          return_full_text: false,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const fortune = apiResponse.data[0].generated_text.trim();
    return response.status(200).json({ fortune });
  } catch (error: any) {
    console.error('Error calling Hugging Face API:', error.message, error.response?.data);
    if (error.response?.data?.error?.includes("is currently loading")) {
      return response.status(503).json({ error: "The model is currently loading, please try again in a few moments." });
    }
    return response.status(500).json({ error: 'Failed to get fortune from AI.' });
  }
}
