import 'mocha';
import { expect } from 'chai';
import { DroneLocationReceivedHandler } from "../src/location-received-handler";
import { InMemoryRepository } from '../src/repository';
import { DroneLocation } from "../src/types";
import { MakeFakeNow } from '../src/now';


describe('DroneLocationReceivedHandler tests', () => {
    const droneId = 'drone_id';
    const nowTime = new Date('2001-1-1 23:40:00');
    const seqnum = 1;
    const droneLocation = { droneId, seqnum, location: { altitude: 1, longitude: 2, latitude: 3 }, timeReported: new Date('2001-1-1 23:30:00') };
    const newLocation = { altitude: 2, longitude: 3, latitude: 4 };

    let target: DroneLocationReceivedHandler;
    let locations: InMemoryRepository<DroneLocation>;


    beforeEach(() => {
        locations = new InMemoryRepository<DroneLocation>();
        target = new DroneLocationReceivedHandler(MakeFakeNow(nowTime), locations);
    });

    it('when drone absent in storage onEvent should add drone location', () => {
        let newSeqnum = seqnum + 1;
        target.onEvent(droneId, newSeqnum, newLocation);
        let drone = locations.getItem(droneId)!;
        expect(drone.droneId).equals(droneId);
        expect(drone.seqnum).equals(newSeqnum);
        expect(drone.location).equals(newLocation);
        expect(drone.timeReported).equals(nowTime);
        expect(drone.timeReported).equals(nowTime);
    });

    context('when drone exists in storage', () => {
        beforeEach(() => {
            locations.setItem(droneId, droneLocation);
        });

        it('and new seqnum is larger than old seqnum onEvent should change drone location', () => {
            let newSeqnum = seqnum + 1;
            target.onEvent(droneId, newSeqnum, newLocation);
            let drone = locations.getItem(droneId)!;
            expect(drone.droneId).equals(droneId);
            expect(drone.seqnum).equals(newSeqnum);
            expect(drone.location).equals(newLocation);
            expect(drone.timeReported).equals(nowTime);
        });

        it('and new seqnum is smaller than old seqnum onEvent should not change drone location', () => {
            let newSeqnum = seqnum - 1;
            target.onEvent(droneId, newSeqnum, newLocation);
            let drone = locations.getItem(droneId)!;
            expect(drone).equals(droneLocation);
        });
    });
});