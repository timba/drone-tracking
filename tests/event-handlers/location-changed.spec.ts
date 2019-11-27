import 'mocha';
import { expect } from 'chai';
import { DroneLocationChangedHandler } from "../../src/event-handlers/location-changed";
import { DroneLocation } from "../../src/types";
import { InMemoryBus } from '../../src/event-bus';
import { events } from '../../src/events';
import { getTimeInterval, distance_on_geoid } from '../../src/math';

describe('DroneLocationChangedHandler tests', () => {
    const droneId = 'drone_id';
    const seqnum = 1;
    const oldLocation = { altitude: 1, longitude: 2, latitude: 3 };
    const oldDroneLocation = { droneId, seqnum, location: oldLocation, timeReported: new Date('2001-1-1 23:30:00') };
    const newLocation = { altitude: 4, longitude: 5, latitude: 6 };
    const newDroneLocation = { droneId, seqnum, location: newLocation, timeReported: new Date('2001-1-1 23:30:05') };

    let target: DroneLocationChangedHandler;
    let bus: InMemoryBus;

    let distanceEventDroneId: string | undefined;
    let velocityEventDroneId: string | undefined;
    let eventDistance: number | undefined;
    let eventTimeInterval: number | undefined;
    let eventVelocity: number | undefined;

    beforeEach(() => {
        distanceEventDroneId = undefined;
        eventDistance = undefined;
        eventTimeInterval = undefined;

        velocityEventDroneId = undefined;
        eventVelocity = undefined;

        bus = new InMemoryBus();
        bus.subscribe(events.DroneDistanceMeasured, {
            onEvent(droneId: string, distance: number, timeInterval: number) {
                distanceEventDroneId = droneId;
                eventDistance = distance;
                eventTimeInterval = timeInterval;
            }
        });

        bus.subscribe(events.DroneVelocityMeasured, {
            onEvent(droneId: string, velocity: number) {
                velocityEventDroneId = droneId;
                eventVelocity = velocity;
            }
        });

        target = new DroneLocationChangedHandler(bus);
    });

    it(`onEvent should publish event ${events.DroneDistanceMeasured}`, () => {
        target.onEvent(droneId, oldDroneLocation, newDroneLocation);
        expect(distanceEventDroneId).equals(droneId);
    });

    it('onEvent should calculate time interval', () => {
        target.onEvent(droneId, oldDroneLocation, newDroneLocation);
        expect(eventTimeInterval).equals(
            getTimeInterval(
                oldDroneLocation.timeReported,
                newDroneLocation.timeReported));
    });

    it('onEvent should calculate distance', () => {
        target.onEvent(droneId, oldDroneLocation, newDroneLocation);
        expect(eventDistance).equals(
            distance_on_geoid(
                oldLocation.latitude, oldLocation.longitude,
                newLocation.latitude, newLocation.longitude));
    });

    it(`onEvent should publish event ${events.DroneVelocityMeasured}`, () => {
        target.onEvent(droneId, oldDroneLocation, newDroneLocation);
        expect(velocityEventDroneId).equals(droneId);
    });

    it('when time interval more than 0s onEvent should calculate velocity', () => {
        target.onEvent(droneId, oldDroneLocation, newDroneLocation);
        expect(eventVelocity).equals(
            distance_on_geoid(
                oldLocation.latitude, oldLocation.longitude,
                newLocation.latitude, newLocation.longitude) /
            getTimeInterval(
                oldDroneLocation.timeReported,
                newDroneLocation.timeReported));
    });

    it('when time interval is 0s onEvent should publish velocity 0 m/s', () => {
        let newDroneLocationImmediate: DroneLocation = {
            droneId,
            seqnum,
            location: newDroneLocation.location,
            timeReported: oldDroneLocation.timeReported
        }

        target.onEvent(droneId, oldDroneLocation, newDroneLocationImmediate);

        expect(eventVelocity).equals(0);
    });

});