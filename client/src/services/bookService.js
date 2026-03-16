import axios from 'axios';

const API_URL = 'http://localhost:5000/api/books';

const getAuthHeaders = () => {
    const token = localStorage.getItem('lumi_token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const bookService = {
    getBooksAdmin: async (page = 1, limit = 10, search = '') => {
        const response = await axios.get(`${API_URL}/admin?page=${page}&limit=${limit}&search=${search}`, getAuthHeaders());
        return response.data;
    },
    getBookById: async (id) => {
        const response = await axios.get(`${API_URL}/admin/${id}`, getAuthHeaders());
        return response.data;
    },
    createBook: async (data) => {
        const response = await axios.post(`${API_URL}/admin`, data, getAuthHeaders());
        return response.data;
    },
    updateBook: async (id, data) => {
        const response = await axios.put(`${API_URL}/admin/${id}`, data, getAuthHeaders());
        return response.data;
    },
    toggleStatus: async (id, trang_thai) => {
        const response = await axios.patch(`${API_URL}/admin/${id}/status`, { trang_thai }, getAuthHeaders());
        return response.data;
    },
    getBestSellers: async () => {
        const response = await axios.get(`${API_URL}/best-sellers`);
        return response.data;
    },
    getPublicBookById: async (id) => { 
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },
};

export default bookService;