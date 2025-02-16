// src/api/index.ts
import axios from 'axios';
import { APIConfiguration } from '@/configs/api.config';

// Membuat custom Axios instance dengan konfigurasi dasar
export const customAxios = axios.create({
  baseURL: APIConfiguration.baseURL, // URL dasar API
  headers: {
    'API-Key': APIConfiguration.APIKey, // API key untuk otentikasi
    'Content-Type': 'application/json', // Menyatakan bahwa data dalam format JSON
  },
});
