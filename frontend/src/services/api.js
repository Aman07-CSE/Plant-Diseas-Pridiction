import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000, // 2 minute timeout for model inference + Gemini
});

/**
 * Predict plant disease from an image file
 * @param {File|Blob} imageFile - The image file to analyze
 * @returns {Promise} - Prediction result with recommendation
 */
export const predictDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Send a chat message to the AI chatbot
 * @param {string} message - User's message
 * @param {Array} history - Chat history array [{role, content}, ...]
 * @returns {Promise} - AI response
 */
export const sendChatMessage = async (message, history = []) => {
  const response = await api.post('/chat', { message, history });
  return response.data;
};

/**
 * Check backend health
 * @returns {Promise} - Health status
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
