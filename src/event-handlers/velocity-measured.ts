import { IRepository } from '../repository';

export class DroneVelocityMeasuredHandler {
    constructor(private droneVelocityRepository: IRepository<number>) { }

    onEvent(droneId: string, velocity: number) {
        console.debug('velocity measured', droneId, velocity);
        this.droneVelocityRepository.setItem(droneId, velocity);
    }
}
