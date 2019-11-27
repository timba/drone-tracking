import { DronePackets, DroneLocation } from "../types";
import { IRepository } from '../repository';

export class DronePacketsStatHandler {
    constructor(private dronePackets: IRepository<DronePackets>) { }

    onEvent(droneId: string, oldLocation: DroneLocation, newLocation: DroneLocation) {
        let oldPackets = this.dronePackets.getItem(droneId);
        let newPackets = !oldPackets ?
            {
                received: 1,
                missed: 0
            } :
            {
                received: oldPackets.received + 1,
                missed: oldPackets.missed + (newLocation.seqnum - oldLocation.seqnum - 1),
            };

        this.dronePackets.setItem(droneId, newPackets);
    }
}
