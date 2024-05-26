# Use the official Node.js 14 image as the base image
FROM node:14

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the application port (change this if your app uses a different port)
EXPOSE 3000

# Define the command to run the application
CMD ["nodemon", "start"]
