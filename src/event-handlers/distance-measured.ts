import { DroneDistance } from '../types';
import { IRepository } from '../repository';
import { IList, LimitedDepthList } from '../list';

export class DroneDistanceMeasuredHandler {
    constructor(private depth: number, 
        private droneDistanceRepository: IRepository<IList<DroneDistance>>) {}

    public onEvent(droneId: string, distance: number, timeInterval: number) {
        console.debug('distance measured', droneId, distance);

        let distances = this.droneDistanceRepository.getItem(droneId);
        if (distances == undefined) {
            distances = new LimitedDepthList<DroneDistance>(this.depth);
        }
        
        distances.add({
            distance: distance,
            timeInterval: timeInterval
        });

        this.droneDistanceRepository.setItem(droneId, distances);
    }
}
