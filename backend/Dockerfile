# Usa una imagen ligera de Node
FROM node:20-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias (solo producción para ser más rápido y seguro)
RUN npm install --only=production

# Copia el resto del código del backend
COPY . .

# El puerto donde corre tu servidor
EXPOSE 3000

# Comando para arrancar el servidor
CMD ["node", "server.js"]