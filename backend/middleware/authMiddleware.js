const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // RS-05: Ahora buscamos el token en las cookies seguras, no en el Header
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; 
        next(); 
    } catch (error) {
        res.status(403).json({ error: 'Token no válido o expirado.' });
    }
};

module.exports = verificarToken;