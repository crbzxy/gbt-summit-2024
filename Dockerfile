# Usa una imagen oficial de Node.js como base para construir la aplicación
FROM node:18-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Agrega las variables de entorno
ARG MONGODB_URI
ARG JWT_SECRET
ENV MONGODB_URI="$MONGODB_URI"
ENV JWT_SECRET="$JWT_SECRET"

# Instala las dependencias del proyecto
RUN npm install

# Copia el código fuente del proyecto
COPY . .

# Construye la aplicación Next.js para producción
RUN MONGODB_URI="$MONGODB_URI" JWT_SECRET="$JWT_SECRET" npm run build

# Segunda fase: imagen de producción ligera
FROM node:18-alpine AS production

# Establece el directorio de trabajo en la imagen de producción
WORKDIR /app

# Copia solo los archivos necesarios desde la fase de construcción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Exponer el puerto
EXPOSE 3000

# Iniciar la aplicación
CMD ["npm", "start"]
