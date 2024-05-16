import React, { useEffect, useState } from 'react';
import { getUsers, createUser, deleteUser, updateUser } from '../api/api';
import ErrorModal from './ErrorModal';

function DashboardComponent({ onLogout }) {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ id: '', name: '', username: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isTokenError, setIsTokenError] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            handleError(error, 'Error al obtener usuarios.')
        }
    };

    const handleLogout = () => {
        onLogout();
    };

    const handleCreateUser = async () => {
        try {
            if (newUser.name === '' || newUser.username === '' || newUser.email === '') {
                handleError(null, 'Error al crear el usuario. Por favor, complete todos los campos.')
                return;
            }
            newUser.id = Math.floor(Math.random() * 1000);
            await createUser(newUser);
            setUsers([...users, newUser])
            setNewUser({ id: '', name: '', username: '', email: '' });
        } catch (error) {
            handleError(error, 'Error al crear el usuario.')
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        } catch (error) {
            handleError(error, 'Error al eliminar el usuario.')

        }
    };

    const handleUpdateUser = async (userId) => {
        try {
            await updateUser(userId, newUser);
            const updatedUsers = users.map(user => {
                if (user.id === userId) {
                    return newUser;
                }
                return user;
            }
            );
            setUsers(updatedUsers);
            setEditingUserId(null);
            setIsEditing(false);
            setNewUser({ id: '', name: '', username: '', email: '' });
        } catch (error) {
            handleError(error, 'Error al actualizar usuarios.')
        }
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };
    const handleError = (error, message) => {
        if (error) {
            error = JSON.parse(error.message)
        }
        if (error && error.status === 401) {
            setErrorMessage('¡Token de sesión expirado! Por favor, vuelva a iniciar sesión.');
            setIsTokenError(true);
        } else {
            setErrorMessage(`${message}`);
        }
        setIsErrorModalOpen(true);
    }

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-heading">Dashboard</h2>
            <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
            <ErrorModal isOpen={isErrorModalOpen} errorMessage={errorMessage} onClose={handleCloseErrorModal} isTokenError={isTokenError} onLogout={onLogout} />

            <div className="user-list-container">
                {!isEditing && (
                    <div className="create-user-container">
                        <h3>{editingUserId ? 'Editar usuario:' : 'Crear nuevo usuario:'}</h3>
                        <input
                            type="text"
                            value={newUser.name}
                            placeholder="Nombre"
                            onChange={e => setNewUser(prevState => ({ ...prevState, name: e.target.value }))}
                        />
                        <input
                            type="text"
                            value={newUser.username}
                            placeholder="Username"
                            onChange={e => setNewUser(prevState => ({ ...prevState, username: e.target.value }))}
                        />
                        <input
                            type="text"
                            value={newUser.email}
                            placeholder="Email"
                            onChange={e => setNewUser(prevState => ({ ...prevState, email: e.target.value }))}
                        />
                        <button onClick={editingUserId ? () => handleUpdateUser(editingUserId) : handleCreateUser}>
                            {editingUserId ? 'Guardar' : 'Crear usuario'}
                        </button>
                    </div>
                )}
                <h3>Usuarios:</h3>
                <ul className="user-list">
                    {users.map(user => (
                        <li key={user.id} className="user-item">
                            {isEditing && editingUserId === user.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={newUser.name}
                                        placeholder="Nombre"
                                        onChange={e => setNewUser(prevState => ({ ...prevState, name: e.target.value }))}
                                    />
                                    <input
                                        type="text"
                                        value={newUser.username}
                                        placeholder="Username"
                                        onChange={e => setNewUser(prevState => ({ ...prevState, username: e.target.value }))}
                                    />
                                    <input
                                        type="text"
                                        value={newUser.email}
                                        placeholder="Email"
                                        onChange={e => setNewUser(prevState => ({ ...prevState, email: e.target.value }))}
                                    />
                                </>
                            ) : (
                                <>
                                    <div>{user.name}</div>
                                    <div>{user.username}</div>
                                    <div>{user.email}</div>
                                </>
                            )}
                            {isEditing && editingUserId === user.id ? (
                                <button onClick={() => handleUpdateUser(user.id)}>Guardar</button>
                            ) : (
                                <>
                                    <button onClick={() => { setIsEditing(true); setEditingUserId(user.id); setNewUser(user) }}>Editar</button>
                                    <button onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
}

export default DashboardComponent;
