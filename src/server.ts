import { install as installMapSupport } from 'source-map-support';

installMapSupport();

import { DroneLocation, DroneDistance } from "./types";
import { IList } from './list';
import { InMemoryRepository } from './repository';
import { RealNow } from './now';
import { InMemoryBus } from './event-bus';
import { events } from './events';

import { DroneLocationReceivedHandler } from './event-handlers/location-received';
import { DroneLocationChangedHandler } from "./event-handlers/location-changed";
import { DroneDistanceMeasuredHandler } from "./event-handlers/distance-measured";
import { DroneVelocityMeasuredHandler } from "./event-handlers/velocity-measured";

const distanceStorageDepth = 20;
const timeDistanceLimit = 10;

const bus = new InMemoryBus();

let locationRepository = new InMemoryRepository<DroneLocation>();
let distanceRepository = new InMemoryRepository<IList<DroneDistance>>();
let velocityRepository = new InMemoryRepository<number>();

let locationReceived = new DroneLocationReceivedHandler(RealNow, bus, locationRepository);
let locationChanged  = new DroneLocationChangedHandler(bus);
let distanceMeasured = new DroneDistanceMeasuredHandler(distanceStorageDepth, distanceRepository);
let velocityMeasured = new DroneVelocityMeasuredHandler(velocityRepository);

bus.subscribe(events.DroneLocationReceived, locationReceived);
bus.subscribe(events.DroneLocationChanged , locationChanged);
bus.subscribe(events.DroneDistanceMeasured, distanceMeasured);
bus.subscribe(events.DroneVelocityMeasured, velocityMeasured);

import { DronesViewBuilder } from './drone-view';

let dronesViewBuilder = new DronesViewBuilder(timeDistanceLimit, RealNow, 
    locationRepository, distanceRepository, velocityRepository);  
    
import { start as startHttp } from './httpServer';
import { start as startUdp } from './udpServer';

startUdp(50050, bus);
startHttp(8080, dronesViewBuilder);    