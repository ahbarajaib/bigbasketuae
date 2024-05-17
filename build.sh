#!/bin/bash

# Pull the code from the remote repository
git pull origin main

# Check if git pull was successful
if [ $? -ne 0 ]; then
  echo "Error: Git pull failed"
  exit 1
fi

# Install dependencies for the backend
npm install

# Check if npm install was successful
if [ $? -ne 0 ]; then
  echo "Error: npm install failed"
  exit 1
fi

# Navigate to the frontend directory
cd frontend || exit 1

# Install dependencies for the frontend
npm install

# Check if npm install for frontend was successful
if [ $? -ne 0 ]; then
  echo "Error: npm install for frontend failed"
  exit 1
fi

# Build the frontend
npm run build

# Check if npm run build was successful
if [ $? -ne 0 ]; then
  echo "Error: npm run build failed"
  exit 1
fi

# Copy the built files to the server directory
cp -r build/* /var/www/bigbasketuae/frontend

# Check if copy operation was successful
if [ $? -ne 0 ]; then
  echo "Error: Copy operation failed"
  exit 1
fi

# Navigate back to the project root directory
cd ..

# Reload Nginx to apply changes
systemctl reload nginx

# Check if Nginx reload was successful
if [ $? -ne 0 ]; then
  echo "Error: Nginx reload failed"
  exit 1
fi

echo "Build and deployment completed successfully"

