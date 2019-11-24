import dgram from 'dgram';

let client = dgram.createSocket('udp4');
client.send(`${Math.random().toString()},location`, 50050, "localhost");
