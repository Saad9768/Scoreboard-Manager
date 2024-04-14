# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies
RUN npm i

#Run all the test cases
RUN npm test

# Creates a "dist" folder with the production build
RUN npm run dev:build

# Start the server using the production build
CMD [ "npm", "start"]
