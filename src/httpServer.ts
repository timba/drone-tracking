import express from 'express';
import { create as createHbs } from 'express-handlebars';
import path from 'path';
import { AddressInfo } from 'net';
import { DronesViewBuilder } from './drone-view';

export function start(port: number, dronesViewBuilder: DronesViewBuilder) {
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
            drones: dronesViewBuilder.getDronesView()
        });
    });

    let app = httpServer.listen(port, () => {
        const address = <AddressInfo>app.address();
        console.log(`HTTP server listening ${address.address}:${address.port}`);
      });    
}