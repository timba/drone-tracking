import 'mocha';
import { expect } from 'chai';
import { DroneLocationReceivedHandler } from "../../src/event-handlers/location-received";
import { InMemoryRepository } from '../../src/repository';
import { DroneLocation } from "../../src/types";
import { MakeFakeNow } from '../../src/now';
import { InMemoryBus } from '../../src/event-bus';
import { events } from '../../src/events';

describe('DroneLocationReceivedHandler tests', () => {
    const droneId = 'drone_id';
    const nowTime = new Date('2001-1-1 23:40:00');
    const seqnum = 1;
    const droneLocation = { droneId, seqnum, location: { altitude: 1, longitude: 2, latitude: 3 }, timeReported: new Date('2001-1-1 23:30:00') };
    const newLocation = { altitude: 2, longitude: 3, latitude: 4 };

    let target: DroneLocationReceivedHandler;
    let locations: InMemoryRepository<DroneLocation>;
    let bus: InMemoryBus;

    let eventDroneId: string | undefined;
    let eventOldLocation: DroneLocation | undefined;
    let eventNewLocation: DroneLocation | undefined;

    beforeEach(() => {
        eventDroneId = undefined;
        eventOldLocation = undefined;
        eventNewLocation = undefined;
        locations = new InMemoryRepository<DroneLocation>();
        bus = new InMemoryBus();
        bus.subscribe(events.DroneLocationChanged, {
            onEvent(droneId: string, oldLocation: DroneLocation, newLocation: DroneLocation) {
                eventDroneId = droneId;
                eventOldLocation = oldLocation;
                eventNewLocation = newLocation;
            }
        });

        target = new DroneLocationReceivedHandler(MakeFakeNow(nowTime), bus, locations);
    });

    context('when drone absent in storage', () => {
        it('onEvent should add drone location', () => {
            let newSeqnum = seqnum + 1;
            target.onEvent(droneId, newSeqnum, newLocation);
            let drone = locations.getItem(droneId)!;
            expect(drone.droneId).equals(droneId);
            expect(drone.seqnum).equals(newSeqnum);
            expect(drone.location).equals(newLocation);
            expect(drone.timeReported).equals(nowTime);
        });

        it(`onEvent should not publish event '${events.DroneLocationChanged}'`, () => {
            target.onEvent(droneId, seqnum + 1, newLocation);
            expect(eventDroneId).equals(undefined);
        });
    });

    context('when drone exists in storage', () => {
        beforeEach(() => {
            locations.setItem(droneId, droneLocation);
        });

        context('and new seqnum is larger than old seqnum', () => {

            let newSeqnum = seqnum + 1;

            it('onEvent should change drone location', () => {
                target.onEvent(droneId, newSeqnum, newLocation);
                let drone = locations.getItem(droneId)!;
                expect(drone.droneId).equals(droneId);
                expect(drone.seqnum).equals(newSeqnum);
                expect(drone.location).equals(newLocation);
                expect(drone.timeReported).equals(nowTime);
            });

            it(`onEvent should publish event '${events.DroneLocationChanged}'`, () => {
                target.onEvent(droneId, newSeqnum, newLocation);
                expect(eventDroneId).equals(droneId);
                expect(eventOldLocation).equals(droneLocation);
                expect(eventNewLocation).to.eql({
                    droneId,
                    seqnum: newSeqnum,
                    location: newLocation,
                    timeReported: nowTime
                });
            });
        });

        context('and new seqnum is smaller than old seqnum', () => {

            let newSeqnum = seqnum - 1;

            it('onEvent should not change drone location', () => {
                target.onEvent(droneId, newSeqnum, newLocation);
                let drone = locations.getItem(droneId)!;
                expect(drone).equals(droneLocation);
            });

            it(`onEvent should not publish event '${events.DroneLocationChanged}'`, () => {
                target.onEvent(droneId, newSeqnum, newLocation);
                expect(eventDroneId).equals(undefined);
            });
        });
    });
});