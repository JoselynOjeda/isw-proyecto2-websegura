const express = require('express');
const router = express.Router();
const pool = require('../db');
const verificarToken = require('../middleware/authMiddleware');

// Función para registrar en la tabla de Auditoría (RF-06)
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

// 1. LISTAR PRODUCTOS (Acceso para todos los autenticados)
router.get('/', verificarToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// 2. CREAR PRODUCTO (Solo SuperAdmin y Registrador)
router.post('/', verificarToken, async (req, res) => {
    const { rol_id, id } = req.usuario;
    const { codigo, nombre, descripcion, cantidad, precio } = req.body;

    // Validación de Roles (RF-05)
    if (rol_id !== 1 && rol_id !== 3) {
        await registrarAuditoria(id, 'ACCESO DENEGADO - Crear Producto', req.ip, '/api/productos');
        return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO productos (codigo, nombre, descripcion, cantidad, precio) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [codigo, nombre, descripcion, cantidad, precio]
        );

        await registrarAuditoria(id, `PRODUCTO CREADO: ${codigo}`, req.ip, '/api/productos');
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto (¿Código duplicado?)' });
    }
});

module.exports = router;