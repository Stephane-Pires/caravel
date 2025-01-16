# Use the Node.js official image as a base image
ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}

# Set working directory
WORKDIR /workspace

# Install additional packages as needed
RUN apt-get update && apt-get install -y \
    # Example: common utilities or additional tools you need
    # curl \
    # git \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Set the default shell to zsh if you prefer it
SHELL ["/usr/bin/zsh", "-c"]

# Copy over project files (commented out if you mount project directly)
# COPY . /workspace

# Install dependencies (optional if done in the postCreateCommand)
# RUN yarn install

# Set up a volume mount for node_modules (to persist across container restarts)
VOLUME ["/workspace/node_modules"]

# Expose the Next.js development server port
EXPOSE 3000
