import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: BASE_URL,
});

export const getUsers = async() => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await api.get('/users', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        const err = JSON.stringify({
            data: error.response.data,
            status: error.response.status
        });
        throw new Error(err);
    }
};

export const createUser = async(userData) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await api.post('/users', userData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al crear usuario');
    }
};

export const deleteUser = async(userId) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        await api.delete(`/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    } catch (error) {
        throw new Error('Error al eliminar usuario');
    }
};

export const updateUser = async(userId, userData) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await api.put(`/users/${userId}`, userData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al actualizar usuario');
    }
};