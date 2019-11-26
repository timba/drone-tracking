import dgram from 'dgram'
import { Location as LocationMessage } from './loc-message_pb';
import { IBus } from './event-bus';
import { events } from './events';
import { Location } from './types';

export function start(port: number, bus: IBus) {
    const udpServer = dgram.createSocket('udp4');
    udpServer.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        udpServer.close();
    });

    udpServer.on('message', (msg, rinfo) => {
        let messageObject = LocationMessage.deserializeBinary(msg).toObject();

        let location: Location = {
            latitude: messageObject.latitude,
            longitude: messageObject.longitude,
            altitude: messageObject.altitude
        };

        bus.publish(events.DroneLocationReceived, messageObject.droneid, messageObject.seqnum, location);
    });

    udpServer.on('listening', () => {
        const address = udpServer.address();
        console.log(`UDP server listening ${address.address}:${address.port}`);
    });

    udpServer.bind(port);
}