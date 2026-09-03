import axios from 'axios';

export const BASE_SERVER_URL = (import.meta.env.VITE_API_URL || 'https://resume-analyzer-5rkc.onrender.com').replace(/\/$/, '');
export const API_BASE_URL = `${BASE_SERVER_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const analyzeJob = async (jobDescription, title = '') => {
  const response = await api.post('/job/analyze', { job_description: jobDescription, title });
  return response.data;
};

export const evaluateMatch = async (resumeText, jobDescription) => {
  const response = await api.post('/match', { resume_text: resumeText, job_description: jobDescription });
  return response.data;
};

export const generateInterviewQuestions = async (resumeText, jobDescription, missingSkills = []) => {
  const response = await api.post('/interview/generate', {
    resume_text: resumeText,
    job_description: jobDescription,
    missing_skills: missingSkills,
  });
  return response.data;
};

export const queryRAG = async (userQuery, resumeText, jobDescription) => {
  const response = await api.post('/rag/query', {
    user_query: userQuery,
    resume_text: resumeText,
    job_description: jobDescription,
  });
  return response.data;
};

export default api;
