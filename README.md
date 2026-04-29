# 🛡️ Secure Fortress 

Bienvenido al repositorio de **Secure Fortress**, un sistema web desarrollado con un fuerte enfoque en la seguridad, control de acceso basado en roles (RBAC) y mitigación de vulnerabilidades comunes (OWASP Top 10).

## 🚀 Requisitos Previos

Para ejecutar este proyecto de manera local, necesitas tener instalado:
- [Docker](https://www.docker.com/products/docker-desktop/) (Docker Desktop para Windows/Mac o Docker Engine para Linux).
- Git (Opcional, para clonar el repositorio).

## 🛠️ Instalación y Ejecución con Docker

El proyecto está dockerizado para facilitar su despliegue, incluyendo la base de datos, el backend y el frontend.

1. **Abrir la terminal**
   Navega hasta la carpeta principal del proyecto (donde se encuentra el archivo `docker-compose.yml`).

2. **Levantar los contenedores**
   Ejecuta el siguiente comando para construir las imágenes y levantar los servicios en segundo plano:
   ```bash
   docker-compose up -d --build

### Verificar los servicios
Una vez que termine el proceso, puedes comprobar que los contenedores están corriendo con:
```bash
docker ps

# 🚀 Guía de Configuración y Uso del Sistema

## 🌐 Puertos de Acceso
Por defecto, los servicios estarán disponibles en los siguientes puertos locales:

* **Frontend (Interfaz de Usuario):** [http://localhost:5173](http://localhost:5173)
* **Backend (API REST):** [http://localhost:3000](http://localhost:3000)
* **Base de Datos (MySQL):** Puerto `3306`

---

## 🔑 Accesos al Sistema
Para realizar pruebas completas y administrar la plataforma, se ha configurado un usuario administrador por defecto ("SuperAdmin") con privilegios totales.

| Rol | Correo | Contraseña |
| :--- | :--- | :--- |
| **SuperAdmin** | `haru@sistema.com` | `admin123` |


---

## 🛑 Detener el Sistema
Para apagar el sistema y detener los contenedores sin borrar la configuración, ejecuta:

```bash
docker-compose down
