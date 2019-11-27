import 'mocha';
import { expect } from 'chai';
import { distance_on_geoid, getTimeInterval } from '../src/math';

describe('distance_on_geoid tests', () => {
    [{ lat1: 46.491221, lon1: 30.746575, lat2: 46.491812, lon2: 30.747272, exp: 85 },
     { lat1: 43.303054, lon1: -2.249383, lat2: 43.302242, lon2: -2.248396, exp: 121 },
     { lat1: -0.002719, lon1: -91.369543, lat2: 0.009322, lon2: -91.370281, exp: 1343 }].forEach(data => {
        it(`should calculate distance`, () => {
            let dist = distance_on_geoid(data.lat1, data.lon1, data.lat2, data.lon2);
            expect(Math.round(dist)).equals(data.exp);
        })
    })
});

describe('getTimeInterval tests', () => {
    [{ time1: new Date(2000, 1, 1, 1, 0, 0), time2: new Date(2000, 1, 1, 1, 0, 10), exp: 10 },
     { time1: new Date(2000, 1, 1, 1, 0, 10), time2: new Date(2000, 1, 1, 1, 0, 0), exp: 10 },
     { time1: new Date(2000, 1, 1, 1, 0, 0), time2: new Date(2001, 1, 1, 1, 0, 0), exp: 31622400 }].forEach(data =>
        it('should calculate time interval', () => {
            let int = getTimeInterval(data.time1, data.time2);
            expect(int).equals(data.exp);
        }))
});