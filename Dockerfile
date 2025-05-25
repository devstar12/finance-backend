# Use official Node.js LTS image
FROM node:22

# Set working directory
WORKDIR /dist

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
