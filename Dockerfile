# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the built application (from your local machine) into the container
COPY ./build /app

# Expose the port your application will run on (if needed)
EXPOSE 3000

# Define the command to run your application
CMD ["npx", "serve", "-s", "build"]
