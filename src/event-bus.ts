export interface IBus {
    subscribe(event: string, handler: IHandler): { unsubscribe(): void };
    publish(event: string, ...args: any[]): void;
}

export interface IHandler {
    onEvent: Function
}

export class InMemoryBus implements IBus {
    private id = 0;
    private subs = new Map<string, Map<number, IHandler>>();

    subscribe(event: string, handler: IHandler) {
        let eventSubs = this.subs.get(event);
        if (eventSubs == undefined) {
            eventSubs = new Map<number, IHandler>();
            this.subs.set(event, eventSubs);
        }

        let subId = this.id++;
        eventSubs.set(subId, handler);
        return {
            unsubscribe() {
                eventSubs!.delete(subId);
            }
        }
    }

    publish(event: string, ...args: any[]): void {
        let eventSubs = this.subs.get(event);
        if (eventSubs != undefined) {
            eventSubs.forEach(handler => {
                handler.onEvent(...args);
            });
        }
    }
}