import dgram from 'dgram'
import { Location as LocationMessage } from './loc-message_pb';

export function start(port: number, drones: Map<string,string>) {
    const udpServer = dgram.createSocket('udp4');
    udpServer.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        udpServer.close();
    });
      
    udpServer.on('message', (msg, rinfo) => {
        let messageObject = LocationMessage.deserializeBinary(msg).toObject();
        console.log("Received location", messageObject);
        drones.set(messageObject.droneid, JSON.stringify(messageObject));
    });
    
    udpServer.on('listening', () => {
        const address = udpServer.address();
        console.log(`UDP server listening ${address.address}:${address.port}`);
    });
    
    udpServer.bind(port);
}