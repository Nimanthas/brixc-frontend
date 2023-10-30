# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Expose the port your application will run on (adjust as needed)
EXPOSE 3000

# Start your application
CMD [ "npm", "start" ]
