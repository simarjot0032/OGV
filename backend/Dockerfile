FROM node:22

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# Download and extract BRL-CAD 7.40.2 from GitHub Releases
RUN mkdir -p /cli && \
    curl -L https://github.com/BRL-CAD/brlcad/releases/download/rel-7-40-2/brlcad-7.40.2.tar.gz \
         -o /cli/brlcad.tar.gz && \
    tar -xzf /cli/brlcad.tar.gz -C /cli && \
    chmod -R +x /cli/brlcad-7.40.2

# Add BRL-CAD to PATH for app and terminal access
ENV PATH="/cli/brlcad-7.40.2/bin:$PATH"
RUN echo 'export PATH="/cli/brlcad-7.40.2/bin:$PATH"' >> ~/.bashrc && \
    echo 'export PATH="/cli/brlcad-7.40.2/bin:$PATH"' >> ~/.profile

# Build your NestJS project (assumes `yarn build` compiles to `dist/`)
RUN yarn build

# Expose the API port
EXPOSE 3000

# Start your API in production mode
CMD ["yarn", "start:prod"]
