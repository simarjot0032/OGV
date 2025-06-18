FROM node:22

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .


RUN mkdir -p /cli && \
    curl -L https://github.com/BRL-CAD/brlcad/releases/download/BRL-CAD_7.40.2_Linux_x86_64.tar.bz2
    \
         -o /cli/brlcad.tar.gz && \
    tar -xvfj /cli/brlcad.tar.gz -C /cli && \
    chmod -R +x /cli/brlcad-7.40.2


RUN export PATH="/cli/brlcad-7.40.2_Linux_x86_64/bin:$PATH" 

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]
