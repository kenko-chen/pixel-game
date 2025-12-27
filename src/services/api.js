import axios from 'axios';

const API_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

// Mock data for development when no API URL is set
const MOCK_QUESTIONS = Array.from({ length: 20 }, (_, i) => ({
  id: `q${i + 1}`,
  question: `Pixel Question ${i + 1}: What represents "Answer A"?`,
  options: {
    A: `Option A for Q${i + 1}`,
    B: `Option B for Q${i + 1}`,
    C: `Option C for Q${i + 1}`,
    D: `Option D for Q${i + 1}`,
  },
  answer: 'A', // For dev/testing only
}));

export const api = {
  fetchQuestions: async (count = 5) => {
    // If no URL is set, use mock data
    if (!API_URL) {
      console.warn("No API URL in .env, using Mock Data.");
      const shuffled = [...MOCK_QUESTIONS].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }

    try {
      console.log("Fetching from GAS:", API_URL);
      // Try fetching from Google Apps Script
      // Using 'text/plain' content type sometimes helps with raw textual responses in GAS
      const response = await axios.get(`${API_URL}?action=getQuestions&count=${count}`);

      console.log("GAS Response:", response.data);

      if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data;
      } else {
        console.warn("GAS returned format issue or empty data:", response.data);
        // Fallback to error logic below
        throw new Error("Empty or invalid data from GAS");
      }
    } catch (error) {
      console.error("API Fetch Error. Falling back to Mock Data for user experience.", error);
      alert("⚠️ 連接 Google Sheet 失敗，將使用測試題庫 (Mock Data)。\n請檢查 GAS 部署設定是否為 'Anyone'。\n詳細錯誤請見 Console。");

      const shuffled = [...MOCK_QUESTIONS].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
  },

  submitResult: async (payload) => {
    // payload: { userId, score, answers, ... }
    if (!API_URL) {
      console.log("Mock Submit:", payload);
      return { success: true };
    }

    try {
      // Use POST for submission
      // GAS `doPost` often needs stringified body + distinct content type to avoid CORS preflight issues sometimes,
      // or standard 'text/plain' to skip preflight.
      const response = await axios.post(
        API_URL,
        JSON.stringify({ action: 'submit', ...payload }),
        {
          headers: { 'Content-Type': 'text/plain' } // Avoids OPTIONS preflight in some GAS setups
        }
      );
      return response.data;
    } catch (error) {
      console.error("API Error submitting:", error);
      throw error;
    }
  }
};
