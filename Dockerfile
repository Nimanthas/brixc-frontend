# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

RUN npm install -g cross-env@7

# Create a non-root user
RUN useradd -ms /bin/bash myuser

# Change to the non-root user
USER myuser

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Switch back to the root user
USER root

# Copy the rest of your application files to the container
COPY . .

RUN npm cache clean --force

# Install application dependencies in the user's home directory
RUN npm install --force

USER myuser

# Expose the port your application will run on (if needed)
EXPOSE 3000

RUN npm run build

# Define the command to run your application
CMD ["npm", "start"]
