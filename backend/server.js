const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { getUsers, createUser, deleteUser, updateUser } = require('./api');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = 'your-secret-key'; // Cambia esto por una clave segura en un entorno de producción
const TOKEN_EXPIRATION = '30s'; // El token expirará en 30 minutos


// Middleware de autenticación JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    });
}

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verificar si las credenciales coinciden con el usuario "quemado" esperado
    if (username === 'admin' && password === 'password') {
        const accessToken = jwt.sign({ username: 'admin' }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
        return res.json({ accessToken: accessToken });
    } else {
        return res.status(401).send('Credenciales inválidas');
    }
});


// Ruta protegida
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Ruta protegida' });
});

app.get('/users', authenticateToken, async (req, res) => {
    try {
        const posts = await getUsers();
        res.json(posts);
    } catch (error) {
        res.status(500).send('Error al obtener usuarios');
    }
});

app.post('/users', async (req, res) => {
    try {
        const user = req.body;
        const newUser = await createUser(user);
        res.json(newUser);
    } catch (error) {
        res.status(500).send('Error al crear el usuario');
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await deleteUser(id);
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).send('Error al eliminar el usuario');
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.body;
        await updateUser(id, user);
        res.json({ message: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).send('Error al actualizar el usuario');
    }
});

app.get('/health', (req, res) => {
    res.json({ message: 'Servidor en funcionamiento' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});