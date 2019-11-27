import { distance_on_geoid, getTimeInterval } from '../math';
import { DroneLocation } from "../types";
import { IBus } from '../event-bus';
import { events } from '../events';

export class DroneLocationChangedHandler {
    constructor(private bus: IBus) { }

    onEvent(droneId: string, oldLocation: DroneLocation, newLocation: DroneLocation) {
        console.debug('location changed', droneId, JSON.stringify(oldLocation), JSON.stringify(newLocation));

        let timeInterval = getTimeInterval(newLocation.timeReported, oldLocation.timeReported);
        let distance = distance_on_geoid(
            oldLocation.location.latitude, oldLocation.location.longitude, 
            newLocation.location.latitude, newLocation.location.longitude);

        this.bus.publish(events.DroneDistanceMeasured, droneId, distance, timeInterval);

        let velocity = 0;
        if (timeInterval > 0) {
            velocity = distance / timeInterval;
        }

        this.bus.publish(events.DroneVelocityMeasured, droneId, velocity);
    }
}
