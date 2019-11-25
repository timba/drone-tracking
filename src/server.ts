import { install as installMapSupport } from 'source-map-support';
import { start as startHttp } from './httpServer';
import { start as startUdp } from './udpServer';

installMapSupport();

let drones = new Map<string, string>();

startUdp(50050, drones);

startHttp(8080, drones);
