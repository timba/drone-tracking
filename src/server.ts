import { install as installMapSupport } from 'source-map-support';
import { start as startHttp } from './httpServer';
import { start as startUdp } from './udpServer';
import { DroneLocation } from "./types";
import { InMemoryRepository } from './repository';

installMapSupport();

let locationRepository = new InMemoryRepository<DroneLocation>();

startUdp(50050, locationRepository);

startHttp(8080, locationRepository);
