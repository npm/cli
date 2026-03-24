# Use an appropriate Node.js base image (v20 is suitable for current npm cli)
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy application source code (required first for workspaces)
COPY . .

# Install dependencies statically
RUN npm install

# Default command to run the tests
CMD ["npm", "test"]
