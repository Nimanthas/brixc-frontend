# Use an official Nginx runtime as a parent image
FROM nginx:alpine

# Copy the contents of the build directory into the Nginx web root
COPY ./build /usr/share/nginx/html

# Expose the default HTTP port (80)
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
