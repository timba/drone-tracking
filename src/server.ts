import { install as installMapSupport } from 'source-map-support';
import { start as startHttp } from './httpServer';
import { start as startUdp } from './udpServer';
import { DroneLocation } from "./types";
import { InMemoryRepository } from './repository';
import { RealNow } from './now';
import { InMemoryBus } from './event-bus';
import { events } from './events';

import { DroneLocationReceivedHandler } from './event-handlers/location-received';
import { DroneLocationChangedHandler } from "./event-handlers/location-changed";

installMapSupport();

const bus = new InMemoryBus();

let locationRepository = new InMemoryRepository<DroneLocation>();

let locationReceived = new DroneLocationReceivedHandler(RealNow, bus, locationRepository);
let locationChanged  = new DroneLocationChangedHandler(bus);

bus.subscribe(events.DroneLocationReceived, locationReceived);
bus.subscribe(events.DroneLocationChanged , locationChanged);

startUdp(50050, bus);

startHttp(8080, locationRepository);
