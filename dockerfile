# Step 1: Build frontend
FROM node:18 AS builder
WORKDIR /app
COPY ./frontend ./frontend
RUN npm install --prefix ./frontend && npm run build --prefix ./frontend

# Step 2: Prepare backend
FROM node:18 AS backend
WORKDIR /app
COPY ./backend ./backend
RUN npm install --prefix ./backend --production

# Step 3: Serve frontend with NGINX
FROM nginx:alpine
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy backend files
COPY --from=backend /app/backend /backend

# Install bash for backend startup
RUN apk add --no-cache bash

# Expose ports
EXPOSE 80 5001

# Start NGINX and the backend
CMD ["sh", "-c", "nginx -g 'daemon off;' & node /backend/index.js"]
