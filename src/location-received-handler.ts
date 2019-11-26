import { Location, DroneLocation } from "./types";
import { IRepository } from './repository';

export class DroneLocationReceivedHandler {
    constructor(private droneLocationRepository: IRepository<DroneLocation>) {
    }

    onEvent(droneId: string, seqnum: number, location: Location) {
        console.debug('location received', droneId, seqnum, JSON.stringify(location));

        let timeReported = new Date(Date.now());
        let oldLocation = this.droneLocationRepository.getItem(droneId);
        let newLocation = { droneId, location, timeReported, seqnum };

        if (oldLocation == undefined) {
            this.droneLocationRepository.setItem(droneId, newLocation);
        }
        else if (seqnum > oldLocation.seqnum) {
            this.droneLocationRepository.setItem(droneId, newLocation);
        }
    }
}
