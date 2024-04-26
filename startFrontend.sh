#!/bin/bash

# Attempt to fetch the private IP address
# This command works on Linux and might work on other Unix-like systems.
# PRIVATE_IP=$(ip route get 1.2.3.4 | awk '{print $7}' | head -n 1)

# This command works on macOS
PRIVATE_IP=$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -n 1)


# Check if the IP address was successfully retrieved
if [ -z "$PRIVATE_IP" ]; then
  echo "Failed to fetch the private IP address."
  exit 1
fi

echo "Detected Private IP: $PRIVATE_IP"

# Set the REACT_APP_PRIVATE_IP environment variable
export REACT_APP_PRIVATE_IP=$PRIVATE_IP

# Start the frontend in a new tmux session
# Adjust the path as necessary to the root of your React project
cd FrontEnd && REACT_APP_PRIVATE_IP=1234 npm start

# To attach to the session, you can use: tmux attach-session -t frontend
# To kill the session later, use: tmux kill-session -t frontend

