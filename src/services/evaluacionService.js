import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nidopro.up.railway.app/api/v1';

const evaluacionApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
evaluacionApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const evaluacionService = {
  async createEvaluacionDocente(evaluationData) {
    const response = await evaluacionApi.post('/evaluacion-docente-bimestral', evaluationData);
    return response.data;
  },

  async getEvaluacionesDocente() {
    const response = await evaluacionApi.get('/evaluacion-docente-bimestral');
    console.log('API Response:', response.data);
    return response.data.evaluaciones || [];
  },
};
