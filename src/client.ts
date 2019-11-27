import dgram from 'dgram';
import { Location } from './loc-message_pb';
import { generate } from 'randomstring';

var args = process.argv.slice(2);

if (args.length < 3) {
    console.error('Expected 3 or 4 arguments: ip, port, drones count[, send interval (s)]');
    process.exit(1);
}

let ip = args[0];
let port = Number.parseInt(args[1]);
let dronesCount = Number.parseInt(args[2]);
// Message send interval. Default: 1s
const sendInterval = args.length > 3 ? Number.parseFloat(args[3]) : 1;

console.log(`server: ${ip}:${port}, drones count: ${dronesCount}, send interval: ${sendInterval}`)

const client = dgram.createSocket('udp4');

const initLatitude  = 46.491221;
const initLongitude = 30.746575;
const oneMeterLat   = 0.000006953;
const oneMeterLon   = 0.000008200;

class DroneEmulator {
    private seqnum = 0;
    private droneId: string;
    private shift = 0;
    private stopped = false;

    constructor(private interval: number, private moveLat: number, private moveLon: number) {
        this.droneId = generate({
            length: 8,
            capitalization: 'lowercase'
        });
    }

    send() {
        let loc = new Location();
        loc.setDroneid(this.droneId);
        loc.setSeqnum(this.seqnum);
        loc.setLatitude(initLatitude + this.moveLat * this.shift * (this.stopped ? 1 : Math.random()));
        loc.setLongitude(initLongitude + this.moveLon * this.shift * (this.stopped ? 1 : Math.random()));
        loc.setAltitude(124);

        let encoded = loc.serializeBinary();
        client.send(encoded, port, ip, (error, _) => {
            if (error != null) console.error(`Error sending packet from drone `, error);
        });

        // Emulate drone stopped sometimes for 20 sec
        if (this.stopped == false && Math.random() < 0.03) {
            this.stopped = true;
            setTimeout(() => this.stopped = false, 20000);
        }

        this.seqnum++;

        if (this.stopped == false) {
            this.shift++;
        }

        setTimeout(() => this.send(),
            // Emulate telemetry lost sometimes for 20 seconds
            (!this.stopped && Math.random() < 0.02) ? 20000 : this.interval * 1000);
    }
}

for (let i = 0; i < dronesCount; i++) {
    let startDelay = Math.random() * 1000;
    setTimeout(() => {
        new DroneEmulator(
            sendInterval,
            oneMeterLat * Math.random() * 10,
            oneMeterLon * Math.random() * 10).send()
    }, startDelay);
}