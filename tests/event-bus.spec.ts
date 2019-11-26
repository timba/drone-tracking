import 'mocha';
import { expect } from 'chai';
import { InMemoryBus } from '../src/event-bus';

describe('InMemoryBus tests', () => {
    let target: InMemoryBus;
    let eventData = { data: 1 };
    let receivedData: any;
    let handler = {
        onEvent(eventData: any): void {
            receivedData = eventData;
        }
    };

    let event = 'event-name';
    let subscription: { unsubscribe(): void };

    beforeEach(() => {
        target = new InMemoryBus();
        receivedData = undefined;
        subscription = target.subscribe(event, handler);
    });

    it('when event matches subscribed handler should receive event data', () => {
        target.publish(event, eventData);
        expect(receivedData).equals(eventData);
    })

    it('when event doesn\'t match subscribed handler should not receive event data', () => {
        target.publish('unknown event', eventData);
        expect(receivedData).equals(undefined);
    })

    it('unsubscribed handler should not receive event data', () => {
        subscription.unsubscribe();
        target.publish(event, eventData);
        expect(receivedData).equals(undefined);
    })

    it('when event matches all subscribed handlers should receive event data', () => {
        let receivedData2 = undefined;
        let handler2 = {
            onEvent(eventData: any) {
                receivedData2 = eventData;
            }    
        }

        let receivedData3 = undefined;
        let handler3 = {
            onEvent(eventData: any) {
                receivedData3 = eventData;
            }    
        }

        target.subscribe(event, handler2);
        target.subscribe(event, handler3);

        target.publish(event, eventData);
        expect(receivedData).equals(eventData);
        expect(receivedData2).equals(eventData);
        expect(receivedData3).equals(eventData);
    })
});