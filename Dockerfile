# Usa una imagen oficial de Node.js como base
FROM node:18-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Agrega las variables de entorno
ARG MONGODB_URI
ARG JWT_SECRET
ENV MONGODB_URI=$MONGODB_URI
ENV JWT_SECRET=$JWT_SECRET

# Instala las dependencias del proyecto
RUN npm install

# Copia el código fuente del proyecto
COPY . .

# Construye la aplicación Next.js para producción
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Iniciar la aplicación
CMD ["npm", "start"]
