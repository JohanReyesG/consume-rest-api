import React, { useState } from 'react';
import axios from 'axios'
function LoginComponent({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const handleLogin = async () => {
        try {
            setError(false)
            const response = await axios.post('http://localhost:3001/login', { username, password });
            const accessToken = response.data.accessToken;
            localStorage.setItem('accessToken', accessToken);
            console.log('Inicio de sesión exitoso');
            onLogin();

        } catch (error) {
            setError(true)
            console.error('Error de inicio de sesión:', error.response.data);
        }
    };

    return (
        <div className="login-container">
            {error && <span className='error-msg'>Credenciales incorrectas</span>}
            <h1>Iniciar sesión</h1>
            <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
            />
            <button className="login-button" onClick={handleLogin}>Iniciar sesión</button>
        </div>
    );
}

export default LoginComponent;
