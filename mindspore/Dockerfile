# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ["package.json", "yarn.lock", "./"]

# Install app dependencies
RUN yarn

# Bundle app source
COPY . .

# Expose server port
EXPOSE 8000

# Start the server using the production build
CMD ["node", "openai-compatible-server.js"]
