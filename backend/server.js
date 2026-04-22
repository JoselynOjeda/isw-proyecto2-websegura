require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser'); // <-- 1. IMPORTAR COOKIE-PARSER

const app = express();

// Middlewares de seguridad básicos
app.use(helmet()); 
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true                // Permite que viajen las cookies HttpOnly
})); 
app.use(express.json()); 
app.use(cookieParser());           // <-- 2. ACTIVAR COOKIE-PARSER

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