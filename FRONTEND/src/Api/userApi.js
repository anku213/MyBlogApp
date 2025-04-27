import api from '../utils/axiosInterceptor'; // Adjust path as needed

export const getProfile = async () => {
    try {
        const response = await api.get('/user/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/user/profile', profileData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};