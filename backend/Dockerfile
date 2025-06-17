FROM node:22

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .


RUN mkdir -p /cli && \
    curl -L https://github.com/BRL-CAD/brlcad/releases/download/rel-7-40-2/brlcad-7.40.2.tar.gz \
         -o /cli/brlcad.tar.gz && \
    tar -xzf /cli/brlcad.tar.gz -C /cli && \
    chmod -R +x /cli/brlcad-7.40.2


RUN export PATH="/cli/brlcad-7.40.2/bin:$PATH" 

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]
