import dgram from 'dgram';
import { Location } from './loc-message_pb';
import { generate } from 'randomstring';

let client = dgram.createSocket('udp4');

let droneId = generate({
    length: 8,
    capitalization: 'lowercase'
});

let loc = new Location();
loc.setDroneid(droneId);
loc.setSeqnum(1);
loc.setLatitude(2);
loc.setLongitude(3);
loc.setAltitude(4);

let encoded = loc.serializeBinary();
client.send(encoded, 50050, "localhost", (error, _) => {
    if (error != null) console.error(`Error sending packet from drone `, error);
});
