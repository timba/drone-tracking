import express from 'express';
import { create as createHbs } from 'express-handlebars';
import path from 'path';
import { AddressInfo } from 'net';
import { IRepository } from './repository';
import { DroneLocation } from './types';

export function start(port: number, drones: IRepository<DroneLocation>) {
    const httpServer = express();

    let hbs = createHbs({
        defaultLayout: 'index',
        extname: '.hbs',
        layoutsDir: path.join(__dirname, '../src/views'),
    });

    httpServer.set('view engine', 'hbs');
    httpServer.set('views', path.join(__dirname, '../src/views'));
    httpServer.engine('hbs', hbs.engine);
    httpServer.use(express.static('src/assets'));

    httpServer.get('/', (request,response) => {
        let items = Array.from([]);
        
        response.render('index', {
            drones: Array.from(drones.getItems())
        });
    });

    let app = httpServer.listen(port, () => {
        const address = <AddressInfo>app.address();
        console.log(`HTTP server listening ${address.address}:${address.port}`);
      });    
}