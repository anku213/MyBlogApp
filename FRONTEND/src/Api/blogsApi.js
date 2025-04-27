import api from '../utils/axiosInterceptor'; // Adjust path as needed

export const createBlog = async (blogData) => {
  try {
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('author', blogData.author);
    formData.append('description', blogData.description);
    formData.append('category', blogData.category); // Category ID
    if (blogData.image instanceof File) {
      formData.append('image', blogData.image);
    }

    const response = await api.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllBlogs = async ({ search = '', page = 1, limit = 6 }) => {
  try {
    const response = await api.get('/blogs', {
      params: { search, page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getBlogById = async (id) => {
  try {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('author', blogData.author);
    formData.append('description', blogData.description);
    formData.append('category', blogData.category); // Category ID
    if (blogData.image instanceof File) {
      formData.append('image', blogData.image);
    } else if (blogData.image === '') {
      formData.append('image', null);
    }

    const response = await api.put(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// New function to fetch blogs by the logged-in user
export const getMyBlogs = async () => {
  try {
    const response = await api.get('/blogs/my-blogs');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};