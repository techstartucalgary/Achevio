#!/bin/sh

# Navigate to the root directory of your React Native project if not already there
# cd /path/to/your/project

echo "Cleaning React Native project..."

# Check if node_modules directory exists and delete it
if [ -d "node_modules" ]; then
    echo "Deleting node_modules..."
    rm -rf node_modules
else
    echo "node_modules does not exist, skipping..."
fi

# Check if package-lock.json file exists and delete it
if [ -f "package-lock.json" ]; then
    echo "Deleting package-lock.json..."
    rm -f package-lock.json
else
    echo "package-lock.json does not exist, skipping..."
fi

# Optionally, you can clean the cache of npm
echo "Cleaning npm cache..."
npm cache clean --force

# Install dependencies
echo "Installing dependencies..."
npm install

# # If you're using Podfiles for iOS, navigate to the ios directory and install Pods
# if [ -d "ios" ]; then
#     echo "Installing iOS dependencies..."
#     cd ios
#     pod install
#     cd ..
# fi

echo "React Native project cleaned and dependencies reinstalled."
