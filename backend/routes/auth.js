const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const pool = require('../db'); // Importamos la conexión a la BD

// RS-07: Rate Limiting para el Login (Bloquea tras 5 intentos fallidos por 5 minutos)
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 5, // Límite de 5 intentos
    message: { error: 'Demasiados intentos fallidos. Intente de nuevo en 5 minutos.' }
});

// ==========================================
// 1. REGISTRO DE USUARIO (RF-02 y RS-01)
// ==========================================
router.post('/register', async (req, res) => {
    const { username, password, email, rol_id } = req.body;

    try {
        // RF-02: Hashing de contraseña con factor de costo 12
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // RS-01: Protección contra SQL Injection (Usando $1, $2 en lugar de concatenar)
        const query = `
            INSERT INTO usuarios (username, password_hash, email, rol_id) 
            VALUES ($1, $2, $3, $4) RETURNING id, username, email;
        `;
        const values = [username, passwordHash, email, rol_id];

        const newUser = await pool.query(query, values);
        
        res.status(201).json({ 
            mensaje: 'Usuario registrado exitosamente', 
            usuario: newUser.rows[0] 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario (¿Quizás el correo o usuario ya existe?)' });
    }
});

// ==========================================
// 2. LOGIN DE USUARIO (RF-07 y RS-05)
// ==========================================
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario por correo
        const userQuery = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = userQuery.rows[0];

        // Comparar la contraseña ingresada con el Hash guardado
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // RS-05: Generar Token JWT válido por 1 hora
        const token = jwt.sign(
            { id: user.id, rol_id: user.rol_id }, // Payload (datos que viajan en el token)
            process.env.JWT_SECRET,               // Firma secreta
            { expiresIn: '1h', algorithm: 'HS256' } // Algoritmo seguro y expiración
        );

        // Actualizar la fecha del último login
        await pool.query('UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

        res.json({ 
            mensaje: 'Login exitoso', 
            token: token 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor durante el login' });
    }
});

module.exports = router;