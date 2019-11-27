FROM node

WORKDIR /app

COPY . .

RUN npm install && \
    npm run build

ENTRYPOINT node build/client.js $TARGETHOST $TARGETPORT $DRONESCOUNT
