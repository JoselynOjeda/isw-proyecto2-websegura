const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const pool = require('../db'); // Importamos la conexión a la BD

// Función interna para registrar en Auditoría (RF-06)
const registrarAuditoria = async (usuario_id, evento, ip, ruta) => {
    try {
        await pool.query(
            'INSERT INTO auditoria (usuario_id, evento, ip_origen, ruta_solicitada) VALUES ($1, $2, $3, $4)',
            [usuario_id, evento, ip, ruta]
        );
    } catch (err) { 
        console.error('Error en log de auditoría:', err); 
    }
};

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

        // RS-01: Protección contra SQL Injection
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
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// ==========================================
// 2. LOGIN DE USUARIO (RF-07, RS-05 y RF-06)
// ==========================================
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario por correo
        const userQuery = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (userQuery.rows.length === 0) {
            await registrarAuditoria(null, `LOGIN FALLIDO (Correo no existe): ${email}`, req.ip, '/api/auth/login');
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = userQuery.rows[0];

        // Comparar la contraseña ingresada con el Hash guardado
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            await registrarAuditoria(user.id, 'LOGIN FALLIDO (Clave incorrecta)', req.ip, '/api/auth/login');
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // RS-05: Generar Token JWT válido por 1 hora
        const token = jwt.sign(
            { id: user.id, rol_id: user.rol_id }, 
            process.env.JWT_SECRET,               
            { expiresIn: '1h', algorithm: 'HS256' } 
        );

        // Actualizar la fecha del último login
        await pool.query('UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

        // RF-06: Registrar login exitoso en auditoría
        await registrarAuditoria(user.id, 'LOGIN EXITOSO', req.ip, '/api/auth/login');

        // RS-05: Enviar el Token en una Cookie HttpOnly (Protección XSS)
        res.cookie('token', token, {
            httpOnly: true, // El navegador no deja que JavaScript lo lea (Evita XSS)
            secure: false,  // Poner en true solo si usas HTTPS
            maxAge: 3600000 // 1 hora
        }).json({ 
            mensaje: 'Login exitoso',
            rol: user.rol_id // Le mandamos el rol al frontend para saber a qué pantalla enviarlo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor durante el login' });
    }
});

module.exports = router;