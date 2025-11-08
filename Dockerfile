FROM node:18

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy source code
COPY backend/ ./

# Expose port
EXPOSE 8080

# Start command
CMD ["node", "dist/simple-test-server.js"]