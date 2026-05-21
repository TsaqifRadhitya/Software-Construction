# Stage 1: Build the React application
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend source
COPY frontend/ ./

# Build the app for production
RUN npm run build

# Stage 2: Serve API Gateway and Frontend with Nginx
FROM nginx:alpine

# Copy the API Gateway Nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the built React assets from the build stage to the Nginx html directory
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
