import dgram from 'dgram';
import express from 'express';
import { create as createHbs } from 'express-handlebars';
import path from 'path';
import { AddressInfo } from 'net';

let drones = new Map<string,string>();

const udpServer = dgram.createSocket('udp4');
udpServer.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    udpServer.close();
  });
  
udpServer.on('message', (msg, rinfo) => {
  console.log(`received ${msg}`)
  let decoded = msg.toString();
  let split = decoded.split(',');
  drones.set(split[0], split[1]);
});
  
udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log(`UDP server listening ${address.address}:${address.port}`);
});
  
udpServer.bind(50050);


const httpServer = express();

let hbs = createHbs({
    defaultLayout: 'index',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, './views'),
});

httpServer.set('view engine', 'hbs');
httpServer.set('views', path.join(__dirname, './views'));
httpServer.engine('hbs', hbs.engine);

httpServer.get('/', (request,response) => {
    response.render('index', {
        drones: drones.entries()
    });
});

let app = httpServer.listen(8080, () => {
    const address = <AddressInfo>app.address();
    console.log(`HTTP server listening ${address.address}:${address.port}`);
});    
