# Use Node.js as base image
FROM node:23-slim

# Install yarn
RUN corepack enable && corepack prepare yarn@4.5.0 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY packages/zely-js-core/package.json ./packages/zely-js-core/
COPY packages/zely-js/package.json ./packages/zely-js/
COPY packages/zely-js-cli/package.json ./packages/zely-js-cli/
COPY packages/zely-js-dev/package.json ./packages/zely-js-dev/
COPY playground/typescript/package.json ./playground/typescript/
COPY asto.config.js ./asto.config.js
COPY asto.esbuild.js ./asto.esbuild.js

# Install dependencies
RUN yarn install

# Copy source files
COPY packages ./packages
COPY playground/typescript ./playground/typescript

# Build packages
RUN yarn build

# Set working directory to typescript playground
WORKDIR /app/playground/typescript

# Expose port referenced in config
EXPOSE 3001

# Start the development server
CMD ["yarn", "dev"]
