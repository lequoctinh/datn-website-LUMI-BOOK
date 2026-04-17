import axios from 'axios';

const API_URL = 'http://localhost:5000/api/categories';

const getAuthHeaders = () => {
    const token = localStorage.getItem('lumi_token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

const categoryService = {
    getAll: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    getAllCategories: async () => {
        const response = await axios.get(API_URL);
        return response.data; 
    },
    create: async (data) => {
        const response = await axios.post(API_URL, data, getAuthHeaders());
        return response.data;
    },
    update: async (id, data) => {
        const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    }
};

export default categoryService;