FROM node:20-alpine

WORKDIR /app

# Copiar archivos de configuración de npm
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar pnpm y dependencias
RUN npm install -g pnpm
RUN pnpm install

# Copiar el resto del código
COPY . .

# Exponer puerto 4321 (puerto por defecto de Astro)
EXPOSE 4321

# Comando para desarrollo
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]
