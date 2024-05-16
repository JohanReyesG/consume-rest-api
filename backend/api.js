const axios = require('axios');

// Función para obtener posts desde la API externa
async function getUsers() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener posts desde la API externa');
    }
}

async function deleteUser(id) {
    try {
        const response = await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al eliminar el usuario');
    }
}

async function createUser(user) {
    try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/users', user);
        return response.data;
    } catch (error) {
        throw new Error('Error al crear el usuario');
    }
}

async function updateUser(id, user) {
    try {
        const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, user);
        return response.data;
    } catch (error) {
        throw new Error('Error al actualizar el usuario');
    }
}

module.exports = {
    getUsers,
    deleteUser,
    createUser,
    updateUser
};