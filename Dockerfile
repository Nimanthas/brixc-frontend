# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Create a non-root user
RUN groupadd -r myuser && useradd -r -g myuser myuser

# Give the non-root user ownership of the working directory
RUN chown -R myuser:myuser /usr/src/app

# Change to the non-root user
USER myuser

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies, including cross-env
RUN npm install cross-env --save && npm install

# Copy the application code to the container
COPY . .

# Expose the port your application will run on (adjust as needed)
EXPOSE 3000

# Start your application
CMD [ "npm", "start" ]
