# Step 1: Build the app using Node.js
FROM node:18 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# Step 2: Serve the built app using Nginx
FROM nginx:latest

# Remove default nginx index
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
