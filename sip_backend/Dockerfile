# This file is used to create a Docker image.
# It is a recipe (blueprint) that tells Docker how to build the image.

# -------- Stage 1: Build --------
FROM node:20-alpine AS builder
# Use Node 20 with Alpine Linux as the base image.
# This creates a lightweight Linux environment inside the container.

WORKDIR /app
# Set the working directory inside the container to /app.

COPY package*.json ./
RUN npm install
# Copy package.json and package-lock.json.
# Install ALL dependencies (including devDependencies). // instead of npm install we can config npm ci  but for that we need impliment ci-cd currrently i havent
# We need devDependencies (like TypeScript) to build the project.

COPY . .
RUN npm run build
# Copy all source code.
# Compile TypeScript -> generates the /dist folder.
# Now compiled JavaScript exists inside /app/dist.


# -------- Stage 2: Production --------
FROM node:20-alpine
# Start a fresh lightweight container for production.

WORKDIR /app

COPY package*.json ./
RUN npm install --production
# Install ONLY runtime dependencies (no devDependencies).
# Production does not need TypeScript or build tools.

COPY --from=builder /app/dist ./dist
# Copy compiled JavaScript from builder stage.
# We do NOT copy src or TypeScript files.

EXPOSE 4000
# Document that the container listens on port 4000.

CMD ["node", "dist/server.js"]
# When the container starts, run the Node server.


# ----------- Execution Steps -----------

# Create .dockerignore file (in backend root)
# Ignore:
# node_modules
# dist
# .git
# .env

# Build image
    #docker build -t sip-backend .
    # sip-backend is the image name

# This creates a Docker image based on the Dockerfile recipe.

# Run container
    #docker run --name sip-backend-container -p 4000:4000 --env-file .env sip-backend
        # sip-backend-container is the container name 
        # -p 4000:4000 this is port binding   
            # -p HOST_PORT:CONTAINER_PORT 
            # i.e, binding our host machine port ot the contaner internal port(app.listen(4000) here this is the container internal port) (like mapping) 

# This creates and starts a container from the image.

# EXTRA COMMANDA
    #Stop - docker stop sip-backend-container
    #restart - docker rm sip-backend-container

# PORT BINDING FYI
    # Understanding port binding in this scenario is not appropriate 
    # Port binding becomes especially useful when we run someone else’s Docker image. 
    # The application inside that image already listens on a specific container port defined by the developer. 
    # Using the -p option, we can map that container port to any port on our host machine. 
    # This allows us to choose a different host port if needed. It is particularly helpful when running multiple instances of the same container, 
    # because each container can use the same internal port while being exposed on different host ports on our system.