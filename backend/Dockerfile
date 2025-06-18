# Use Node.js base image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to install dependencies first
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application files into the container
COPY . .

# Download BRL-CAD, extract it, and set proper executable permissions
RUN mkdir -p /cli && \
    curl -L https://github.com/BRL-CAD/brlcad/releases/download/rel-7-40-2/BRL-CAD_7.40.2_Linux_x86_64.tar.bz2 -o /cli/brlcad.tar.bz2 && \
    ls -l /cli && \
    ls -lh /cli/brlcad.tar.bz2 && \
    tar -xvjf /cli/brlcad.tar.bz2 -C /cli && \
    ls -l /cli && \
    chmod -R +x /cli/BRL-CAD_7.40.2_Linux_x86_64 && \
    ls -l /cli/ 

# Set the PATH for BRL-CAD binaries
ENV PATH="/cli/BRL-CAD_7.40.2_Linux_x86_64/bin:$PATH"
RUN echo 'export PATH="/cli/BRL-CAD_7.40.2_Linux_x86_64/bin:$PATH"'

# Run the build command for the Node.js application
RUN yarn build

EXPOSE 3000

# Start the Node.js application in production mode
CMD ["yarn", "start:prod"]
