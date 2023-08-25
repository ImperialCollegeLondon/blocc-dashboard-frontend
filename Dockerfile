# Use an official Node runtime as the parent image
FROM node:20

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY package.json yarn.lock ./

# Install the application's dependencies
RUN yarn install

# Copy the rest of the application's files into the container
COPY . ./

# Install serve
RUN yarn global add serve
