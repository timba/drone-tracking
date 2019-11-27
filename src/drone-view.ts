import { Location, DroneDistance } from "./types";
import { IRepository } from "./repository";
import { DroneLocation } from "./types";
import { Now } from "./now";
import { getTimeInterval } from "./math";
import { IList } from "./list";

export type DroneView = {
    droneId: string,
    location: Location,
    timeReported: string,
    distanceTraveled: number,
    velocity: number,
}

export class DronesViewBuilder {

    constructor(
        private timeDistanceLimit: number,
        private now: Now,
        private droneLocations: IRepository<DroneLocation>,
        private droneDistances: IRepository<IList<DroneDistance>>,
        private droneVelocities: IRepository<number>) { }

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

            return {
                droneId: drone.droneId,
                location: drone.location,
                timeReported: drone.timeReported.toLocaleString(),
                distanceTraveled: Math.round(travelDistance),
                velocity: Math.round(velocity),
            }
        });
    }
}