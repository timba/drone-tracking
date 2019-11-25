export interface IRepository<T> {
    getItem(id: string): T | undefined;
    setItem(id: string, item: T): void;
    getItems(): IterableIterator<T>;
    deleteItem(id: string): void;
}

export class InMemoryRepository<T> implements IRepository<T> {

    private storage = new Map<string, any>();

    getItem(id: string): T | undefined {
        return this.storage.get(id);
    }

    setItem(id: string, item: T): void {
        this.storage.set(id, item);
    }

    getItems(): IterableIterator<T> {
        return this.storage.values();
    }

    deleteItem(id: string): void {
        this.storage.delete(id);
    }
}