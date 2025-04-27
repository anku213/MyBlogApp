import api from "../utils/axiosInterceptor";

export const createCategory = async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  export const getAllCategories = async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  export const updateCategory = async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };
  
  export const deleteCategory = async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };