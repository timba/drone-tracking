FROM node

WORKDIR /app

EXPOSE 50050/udp 8080/tcp

COPY . .

RUN npm install && \
    npm run build

ENTRYPOINT ["node", "build/server.js", "50050", "8080"]
