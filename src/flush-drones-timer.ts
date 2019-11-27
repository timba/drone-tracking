import { IBus } from "./event-bus";
import { events } from "./events";

export function startDronesFlushTimer(interval: number, bus: IBus) {
    let intervalMs = interval * 1000;
    setTimeout(checkFlush, intervalMs);

    function checkFlush(): void {
        bus.publish(events.DroneFlushCheck);
        setTimeout(checkFlush, intervalMs);
    }
}