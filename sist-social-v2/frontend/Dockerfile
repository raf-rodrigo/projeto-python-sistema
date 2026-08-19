FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# RUN npm run build

# Para desenvolvimento, podemos expor o Vite diretamente
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
