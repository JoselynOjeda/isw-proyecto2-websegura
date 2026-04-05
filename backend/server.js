require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middlewares de seguridad básicos
app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 

// Importar rutas
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');

// Usar las rutas (Todo lo de auth empezará con /api/auth)
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);

// Ruta base
app.get('/', (req, res) => {
    res.json({ mensaje: '¡Servidor Backend Seguro en funcionamiento!' });
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto http://localhost:${PORT}`);
});