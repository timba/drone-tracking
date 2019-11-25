import dgram from 'dgram'
import { Location as LocationMessage } from './loc-message_pb';
import { IRepository } from './repository';
import { DroneLocation } from './types';

export function start(port: number, drones: IRepository<DroneLocation>) {
    const udpServer = dgram.createSocket('udp4');
    udpServer.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        udpServer.close();
    });
      
    udpServer.on('message', (msg, rinfo) => {
        let messageObject = LocationMessage.deserializeBinary(msg).toObject();
        console.log("Received location", messageObject);
        let location: DroneLocation = {
            droneId: messageObject.droneid,
            seqnum: messageObject.seqnum,
            location: {
                latitude: messageObject.latitude,
                longitude: messageObject.longitude,
                altitude: messageObject.altitude
            },
            timeReported: new Date(Date.now())
        }
        drones.setItem(messageObject.droneid, location);
    });
    
    udpServer.on('listening', () => {
        const address = udpServer.address();
        console.log(`UDP server listening ${address.address}:${address.port}`);
    });
    
    udpServer.bind(port);
}