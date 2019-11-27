import { IRepository } from '../repository';
import { DroneLocation } from "../types";
import { Now } from '../now';
import { getTimeInterval } from '../math';
import { IBus } from '../event-bus';
import { events } from '../events';


export class DronesFlushCheckEventHandler {
    constructor(private locationRepository: IRepository<DroneLocation>, private now: Now, 
        private lifetime: number, private bus: IBus) {
    }

    onEvent(): void {
        console.debug('Drones flush check started');
        let drones = this.locationRepository.getItems();
        let now = this.now();
        Array.from(drones).forEach(drone => {
            let interval = getTimeInterval(now, drone.timeReported);
            if (interval >= this.lifetime) {
                this.bus.publish(events.DroneFlush, drone.droneId);
            }
        });
    }
}