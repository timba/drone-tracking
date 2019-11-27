import { install as installMapSupport } from 'source-map-support';

installMapSupport();

import { DroneLocation, DroneDistance, DronePackets } from "./types";
import { IList } from './list';
import { InMemoryRepository } from './repository';
import { RealNow } from './now';
import { InMemoryBus } from './event-bus';
import { events } from './events';

import { DroneLocationReceivedHandler } from './event-handlers/location-received';
import { DroneLocationChangedHandler } from "./event-handlers/location-changed";
import { DroneDistanceMeasuredHandler } from "./event-handlers/distance-measured";
import { DroneVelocityMeasuredHandler } from "./event-handlers/velocity-measured";
import { DronePacketsStatHandler } from './event-handlers/packets-stat';
import { DronesFlushCheckEventHandler } from './event-handlers/flush-check';
import { DroneFlushEventHandler } from './event-handlers/flush';

var args = process.argv.slice(2);

if (args.length < 2) {
    console.error('Expected 2 arguments: UDP port, HTTP port');
    process.exit(1);
}

const udpPort = Number.parseInt(args[0]);
const httpPort = Number.parseInt(args[1]);

const distanceStorageDepth = 20;
const timeDistanceLimit = 10;
const droneLifetime = 30;

const bus = new InMemoryBus();

let locationRepository = new InMemoryRepository<DroneLocation>();
let distanceRepository = new InMemoryRepository<IList<DroneDistance>>();
let velocityRepository = new InMemoryRepository<number>();
let packetsRepository  = new InMemoryRepository<DronePackets>();

let locationReceived = new DroneLocationReceivedHandler(RealNow, bus, locationRepository);
let locationChanged  = new DroneLocationChangedHandler(bus);
let distanceMeasured = new DroneDistanceMeasuredHandler(distanceStorageDepth, distanceRepository);
let velocityMeasured = new DroneVelocityMeasuredHandler(velocityRepository);
let packetsStat      = new DronePacketsStatHandler(packetsRepository);
let dronesFlushCheck = new DronesFlushCheckEventHandler(locationRepository, RealNow, droneLifetime, bus);
let droneFlush       = new DroneFlushEventHandler(locationRepository, velocityRepository, distanceRepository);

bus.subscribe(events.DroneLocationReceived, locationReceived);
bus.subscribe(events.DroneLocationChanged , locationChanged);
bus.subscribe(events.DroneLocationChanged , packetsStat);
bus.subscribe(events.DroneDistanceMeasured, distanceMeasured);
bus.subscribe(events.DroneVelocityMeasured, velocityMeasured);
bus.subscribe(events.DroneFlushCheck      , dronesFlushCheck);
bus.subscribe(events.DroneFlush           , droneFlush);

import { DronesViewBuilder } from './drone-view';

let dronesViewBuilder = new DronesViewBuilder(timeDistanceLimit, RealNow, 
    locationRepository, distanceRepository, velocityRepository, packetsRepository);  
    
import { start as startHttp } from './httpServer';
import { start as startUdp } from './udpServer';

startUdp(udpPort, bus);
startHttp(httpPort, dronesViewBuilder);

import { startDronesFlushTimer } from './flush-drones-timer';

startDronesFlushTimer(droneLifetime, bus);