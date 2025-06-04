// src/Api/studyMaterialApi.js
import api from "../utils/axiosInterceptor";

export const getQuestionCategoriesByUser = async (userId) => {
  const response = await api.get(`/study/categories/${userId}`);
  return response.data;
};

export const addCategory = async (userId, name) => {
  const response = await api.post(`/study/category`, { userId, name });
  return response.data;
};

export const getQuestionsByUserAndCategory = async (userId, categoryId) => {
  const response = await api.get(`/study/questions/${userId}/${categoryId}`);
  return response.data;
};

export const addQuestion = async (userId, categoryId, question, answer) => {
  const response = await api.post(`/study/question`, {
    userId,
    categoryId,
    question,
    answer,
  });
  return response.data;
};

export const deleteQuestion = async (questionId) => {
  const response = await api.delete(`/study/question/${questionId}`);
  return response.data;
};
