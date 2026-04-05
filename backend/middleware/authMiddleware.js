const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // Obtener el token del header 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Guardamos los datos del usuario (id, rol) en la petición
        next(); // Permitir que pase a la siguiente función
    } catch (error) {
        res.status(403).json({ error: 'Token no válido o expirado.' });
    }
};

module.exports = verificarToken;