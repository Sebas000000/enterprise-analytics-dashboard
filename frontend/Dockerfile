# Stage 1: Build React/Vite TypeScript App
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies with caching
COPY package*.json ./
RUN npm ci || npm install

# Copy source files and compile production bundle
COPY . .
RUN npm run build

# Stage 2: Serve through lightweight Nginx Alpine
FROM nginx:1.27-alpine AS final

# Custom Nginx SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static distribution files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
