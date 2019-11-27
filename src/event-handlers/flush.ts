import { IRepository } from "../repository";
import { DroneDistance, DroneLocation } from "../types";
import { IList } from "../list";

export class DroneFlushEventHandler {
    constructor(
        private locationRepository: IRepository<DroneLocation>,
        private velocityRepository: IRepository<number>,
        private distanceRepository: IRepository<IList<DroneDistance>>) {
    }

    onEvent(droneId: string): void {
        console.debug('Drone flush started', droneId);
        this.locationRepository.deleteItem(droneId);
        this.velocityRepository.deleteItem(droneId);
        this.distanceRepository.deleteItem(droneId);
    }
}