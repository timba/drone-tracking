import 'mocha';
import { expect } from 'chai';
import { DroneDistance } from '../../src/types';
import { DroneFlushEventHandler } from '../../src/event-handlers/flush';
import { InMemoryRepository } from '../../src/repository';
import { DroneLocation } from "../../src/types";
import { IList, LimitedDepthList } from '../../src/list';

describe('DroneFlushEventHandler tests', () => {
    let target: DroneFlushEventHandler;
    let locations: InMemoryRepository<DroneLocation>;
    let velocities: InMemoryRepository<number>;
    let distances: InMemoryRepository<IList<DroneDistance>>;
    let id = 'drone_id';

    const location = { droneId: id, seqnum: 1, location: { altitude: 1, longitude: 2, latitude: 3 }, timeReported: new Date() };
    const velocity = 5;
    const distance = new LimitedDepthList<DroneDistance>(5);
    distance.add({ distance: 3, timeInterval: 5 });

    beforeEach(() => {
        locations = new InMemoryRepository<DroneLocation>();
        velocities = new InMemoryRepository<number>();
        distances = new InMemoryRepository<LimitedDepthList<DroneDistance>>();

        locations.setItem(id, location);
        velocities.setItem(id, velocity);
        distances.setItem(id, distance);

        target = new DroneFlushEventHandler(locations, velocities, distances);
    });

    context('when id matches', () => {
        it('onEvent should delete location', () => {
            target.onEvent(id);
            expect(locations.getItem(id)).equals(undefined);
        });

        it('onEvent should delete velocity', () => {
            target.onEvent(id);
            expect(velocities.getItem(id)).equals(undefined);
        });

        it('onEvent should delete distances', () => {
            target.onEvent(id);
            expect(distances.getItem(id)).equals(undefined);
        });
    });

    context('when id doesn\'t match', () => {
        it('onEvent should not delete location', () => {
            target.onEvent('unknown_id');
            expect(locations.getItem(id)).equals(location);
        })

        it('onEvent should not delete velocity', () => {
            target.onEvent('unknown_id');
            expect(velocities.getItem(id)).equals(velocity);
        })

        it('onEvent should not delete distances', () => {
            target.onEvent('unknown_id');
            expect(distances.getItem(id)).equals(distance);
        })
    });
});