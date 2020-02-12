FROM node as base

FROM base as build

WORKDIR /app

COPY . .

RUN npm install && \
    npm run build

FROM base as final

WORKDIR /app
EXPOSE 50050/udp 8080/tcp

COPY package.json .
COPY package-lock.json .
RUN npm install --production
COPY --from=build /app/build .

ENTRYPOINT ["node", "server.js", "50050", "8080"]
