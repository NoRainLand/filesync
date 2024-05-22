type CreateObjectFunc<T> = () => T;

export class Pool<T> {
    private createObject: CreateObjectFunc<T>;
    private pool: Array<T>;

    constructor(createObject: CreateObjectFunc<T>) {
        this.createObject = createObject;
        this.pool = [];
    }

    forEach(callback: (value: T, index: number, array: T[]) => void): void {
        this.pool.forEach(callback);
    }

    get(): T {
        if (this.pool.length > 0) {
            this.pool = this.pool.reverse();//翻转
            return this.pool.pop() as T;
        } else {
            return this.createObject();
        }
    }

    recycle(obj: T): void {
        this.pool.push(obj);
    }
}