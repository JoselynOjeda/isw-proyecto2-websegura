const express = require('express');
const router = express.Router();
const pool = require('../db');
const verificarToken = require('../middleware/authMiddleware');

router.get('/', verificarToken, async (req, res) => {
    const { rol_id } = req.usuario;

    if (rol_id !== 1 && rol_id !== 2) { // Solo SuperAdmin (1) y Auditor (2)
        return res.status(403).json({ error: 'Acceso denegado. Solo auditores.' });
    }

    try {
        const result = await pool.query('SELECT * FROM auditoria ORDER BY fecha DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener auditoría' });
    }
});

module.exports = router;