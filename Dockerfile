FROM node:22-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git bash python3 make g++

# Copy package manifests
COPY package.json package-lock.json* ./

# Install project dependencies
RUN npm install --legacy-peer-deps

# Copy project source code
COPY . .

# Run test suite by default
CMD ["npm", "test"]
