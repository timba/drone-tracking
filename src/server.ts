import { install as installMapSupport } from 'source-map-support';
import { start as startHttp } from './httpServer';
import { start as startUdp } from './udpServer';
import { DroneLocation } from "./types";
import { InMemoryRepository } from './repository';
import { InMemoryBus } from './event-bus';
import { events } from './events';

import { DroneLocationReceivedHandler } from './location-received-handler';

installMapSupport();

const bus = new InMemoryBus();

let locationRepository = new InMemoryRepository<DroneLocation>();

let locationReceived = new DroneLocationReceivedHandler(locationRepository);

bus.subscribe(events.DroneLocationReceived, locationReceived);

startUdp(50050, bus);

startHttp(8080, locationRepository);
