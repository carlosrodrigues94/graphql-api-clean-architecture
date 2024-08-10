# Build application
FROM node:20.15.1-alpine as build

# Set working directory
WORKDIR /app

# Install dependencies for building the application
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Stage 2: Run the application in a minimal environment
FROM node:20.15.1-alpine AS production

# Set working directory
WORKDIR /app

# Copy package.json and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the built application from the build stage
COPY --from=build /app/dist dist

# Expose the application port (replace with your app's port if needed)
EXPOSE 4000

# Command to run the application
CMD ["node", "dist/src/main/index.js"]