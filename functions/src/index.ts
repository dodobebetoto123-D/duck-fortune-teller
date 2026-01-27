/* eslint-disable @typescript-eslint/no-explicit-any */
// v2의 onCall과 v1의 functions를 명시적으로 둘 다 가져옵니다.
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import axios from "axios";

// v2 구문을 사용하여 함수를 정의합니다.
export const getSajuFortune = onCall(
  { region: "asia-northeast3" },
  async (request) => {
    // (functions as any)를 사용하여 타입스크립트 검사를 우회하고 v1의 config()에 접근합니다.
    const hfToken = (functions as any).config().huggingface?.key;

    if (!hfToken) {
      throw new HttpsError(
        "internal",
        "Hugging Face API key is not configured.",
      );
    }

    const birthDate = request.data.birthDate;
    if (!birthDate) {
      throw new HttpsError(
        "invalid-argument",
        "The function must be called with one argument 'birthDate'.",
      );
    }

    const prompt = `
      You are a wise and witty fortune-telling duck.
      Your name is "운세덕".
      You are giving a traditional Saju reading, but with a fun and modern twist.
      Keep the response in Korean, be concise (under 200 characters), and always speak in a friendly, duck-like tone, maybe add a "꽥!"(quack!) at the end.

      Analyze the following birth date and time to give a short, encouraging fortune for today: ${birthDate}
    `;

    try {
      const model = "google/gemma-2b-it";
      const response = await axios.post(
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
            "Authorization": `Bearer ${hfToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      const fortune = response.data[0].generated_text.trim();
      return { fortune };
    } catch (error: any) {
      console.error("Error calling Hugging Face API:", error.response?.data);
      if (error.response?.data?.error?.includes("is currently loading")) {
        throw new HttpsError(
          "unavailable",
          "The model is currently loading, please try again in a few moments.",
        );
      }
      throw new HttpsError(
        "internal",
        "Failed to get fortune from AI.",
        error.message,
      );
    }
  }
);
