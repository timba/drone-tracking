export interface IList<T> {
    add(item: T): void;
    items(): ReadonlyArray<T>;
}

export class LimitedDepthList<T> implements IList<T> {

    private storage = new Array<T>();

    constructor(private maxDepth: number) {
    }

    add(item: T): void {
        let x: QueuingStrategy
        this.storage.unshift(item);
        if (this.storage.length > this.maxDepth) {
            this.storage.pop();
        }
    }

    items(): ReadonlyArray<T> {
        return this.storage;
    }
}
