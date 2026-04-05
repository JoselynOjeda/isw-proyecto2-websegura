-- 1. Tabla de Roles (RF-05)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Insertar los roles obligatorios
INSERT INTO roles (nombre) VALUES ('SuperAdmin'), ('Auditor'), ('Registrador');

-- 2. Tabla de Usuarios (RF-04)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Aquí guardaremos el hash de bcrypt/argon2
    email VARCHAR(100) UNIQUE NOT NULL,
    rol_id INTEGER REFERENCES roles(id),
    ultimo_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Productos (RF-03)
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Log de Auditoría (RF-06)
CREATE TABLE auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) NULL, -- Puede ser NULL si alguien intenta entrar y falla
    evento VARCHAR(255) NOT NULL, -- Ej: "Login exitoso", "Producto creado", "Acceso denegado 403"
    ip_origen VARCHAR(45) NOT NULL,
    ruta_solicitada VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);