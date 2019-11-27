import 'mocha';
import { expect } from 'chai';
import { DroneLocation, DroneDistance } from "../../src/types";
import { DronesFlushCheckEventHandler } from '../../src/event-handlers/flush-check';
import { InMemoryRepository } from '../../src/repository';
import { MakeFakeNow } from '../../src/now';
import { InMemoryBus } from '../../src/event-bus';
import { events } from '../../src/events';
import { LimitedDepthList } from '../../src/list';

describe('DroneFlushEventHandler tests', () => {
    const droneId = 'drone_id';
    const droneTime = new Date('2001-1-1 23:30:00');
    let nowTime: Date;
    const droneLocation = { droneId: droneId, seqnum: 1, location: { altitude: 1, longitude: 2, latitude: 3 }, timeReported: droneTime };
    const distance = new LimitedDepthList<DroneDistance>(5);
    distance.add({ distance: 3, timeInterval: 5 });
    const lifeTime = 30;

    let target: DronesFlushCheckEventHandler;
    let locations: InMemoryRepository<DroneLocation>;
    let flushId: string | undefined;
    let bus: InMemoryBus;

    beforeEach(() => {
        flushId = undefined;
        nowTime = new Date(droneTime);
        locations = new InMemoryRepository<DroneLocation>();
        locations.setItem(droneId, droneLocation);
        bus = new InMemoryBus();
        bus.subscribe(events.DroneFlush, {
            onEvent(droneId: string) {
                flushId = droneId;
            }
        });

        target = new DronesFlushCheckEventHandler(locations, MakeFakeNow(nowTime), lifeTime, bus);
    });

    it(`when drone reported time exceedes lifetime onEvent should publish event '${events.DroneFlush}' with drone id`, () => {
        nowTime.setSeconds(lifeTime + 10);
        target.onEvent();
        expect(flushId).equals(droneId);
    });

    it(`when drone reported time does not exceed lifetime onEvent should not publish event '${events.DroneFlush}' with drone id`, () => {
        nowTime.setSeconds(lifeTime - 10);
        target.onEvent();
        expect(flushId).equals(undefined);
    });
});