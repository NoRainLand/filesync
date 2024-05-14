type CreateObjectFunc<T> = () => T;

export class ObjectPool<T> {
    private createObject: CreateObjectFunc<T>;
    private pool: Array<T>;

    constructor(createObject: CreateObjectFunc<T>) {
        this.createObject = createObject;
        this.pool = [];
    }

    get(): T {
        if (this.pool.length > 0) {
            return this.pool.pop() as T;
        } else {
            return this.createObject();
        }
    }

    recycle(obj: T): void {
        this.pool.push(obj);
    }
}