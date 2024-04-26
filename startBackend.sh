#!/bin/bash

# Attempt to fetch the private IP address
# This command works on Linux and might work on other Unix-like systems.
#PRIVATE_IP=$(ip route get 1.2.3.4 | awk '{print $7}' | head -n 1)

# This command works on macOS
PRIVATE_IP=$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -n 1)


# Check if the IP address was successfully retrieved
if [ -z "$PRIVATE_IP" ]; then
  echo "Failed to fetch the private IP address."
  exit 1
fi

# Assuming your Python virtual environment is located in "myenv"
VENV_PATH="myenv"
# Activate your virtual environment
source "${VENV_PATH}/bin/activate"

# Check if activation was successful
if [ $? -ne 0 ]; then
  echo "Failed to activate the virtual environment."
  exit 1
fi

# Now run your litestar command directly
cd Backend && litestar run -r -H ${PRIVATE_IP} --port 8002

# The script exits after starting the litestar command.
# If you run any commands after `litestar`, consider whether you need to deactivate the virtual environment.
