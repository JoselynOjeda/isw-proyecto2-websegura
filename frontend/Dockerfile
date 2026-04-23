# Usar imagen ligera de Node
FROM node:20-alpine

# Carpeta de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODO (necesitamos Vite que es una devDependency)
RUN npm install

# Copiar el resto del código React
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Comando para levantar React expuesto a Docker
CMD ["npm", "run", "dev", "--", "--host"]