require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();

// Middlewares de seguridad básicos
app.use(helmet()); 
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true                // Permite que viajen las cookies HttpOnly
})); 
app.use(express.json()); 
app.use(cookieParser());           // ACTIVAR COOKIE-PARSER

// --- INICIO REQUERIMIENTO RS-03: PROTECCIÓN CSRF ---
app.use((req, res, next) => {
    // Solo protegemos las operaciones de escritura (crear, editar, borrar)
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        const origin = req.headers.origin || req.headers.referer;
        
        // Verificamos que la petición venga exclusivamente de tu frontend en React
        if (!origin || !origin.includes('http://localhost:5173')) {
            console.warn(`[CSRF Alert] Intento bloqueado desde origen: ${origin}`);
            return res.status(403).json({ error: 'RS-03: Petición bloqueada por protección CSRF.' });
        }
    }
    next();
});
// --- FIN REQUERIMIENTO RS-03 ---

// Importar rutas
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const auditoriaRoutes = require('./routes/auditoria');

// Usar las rutas (Todo lo de auth empezará con /api/auth)
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/auditoria', auditoriaRoutes);

// Ruta base
app.get('/', (req, res) => {
    res.json({ mensaje: '¡Servidor Backend Seguro en funcionamiento!' });
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto http://localhost:${PORT}`);
});