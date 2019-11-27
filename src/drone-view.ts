import { Location, DroneDistance, DronePackets } from "./types";
import { IRepository } from "./repository";
import { DroneLocation } from "./types";
import { Now } from "./now";
import { getTimeInterval } from "./math";
import { IList } from "./list";

export type DroneView = {
    droneId: string,
    location: Location,
    timeReported: string,
    sinceLastReported: number,
    distanceTraveled: number,
    velocity: number,
    isStopped: boolean,
    noMessage: boolean,
    missed: number,
    received: number,
}

export class DronesViewBuilder {

    constructor(
        private timeDistanceLimit: number,
        private now: Now,
        private droneLocations: IRepository<DroneLocation>,
        private droneDistances: IRepository<IList<DroneDistance>>,
        private droneVelocities: IRepository<number>,
        private dronePackets: IRepository<DronePackets>) { }

    getDronesView(): DroneView[] {
        let drones = Array.from(this.droneLocations.getItems());
        let now = this.now();
        return drones.map(drone => {
            let velocity = this.droneVelocities.getItem(drone.droneId) || 0;
            let distances: readonly DroneDistance[] = [];
            let distancesList = this.droneDistances.getItem(drone.droneId);
            if (distancesList != undefined) {
                distances = distancesList.items();
            }

            let packets = this.dronePackets.getItem(drone.droneId) 
                || { received: 0, missed: 0 };

            let sinceLastReported = getTimeInterval(now, drone.timeReported);
            let intervalSum = sinceLastReported;
            let travelDistance = 0;
            for (let index = 0; index < distances.length; index++) {
                const element = distances[index];

                if (intervalSum > this.timeDistanceLimit) {
                    break;
                }

                travelDistance += element.distance;
                intervalSum += element.timeInterval;
            }

            let hasStopped = sinceLastReported < this.timeDistanceLimit && travelDistance < 1;
            let noMessage = sinceLastReported >= 10;

            return {
                droneId: drone.droneId,
                location: drone.location,
                timeReported: drone.timeReported.toLocaleString(),
                sinceLastReported: Math.round(sinceLastReported),
                distanceTraveled: Math.round(travelDistance),
                velocity: Math.round(velocity),
                isStopped: hasStopped,
                noMessage: noMessage,
                missed: packets.missed,
                received: packets.received,
            }
        });
    }
}