interface PoolOptions {
    maxSize?: number;
    initialSize?: number;
}

type CreateObjectFunc<T> = () => T;

export class Pool<T> {
    private readonly createObject: CreateObjectFunc<T>;
    private readonly maxSize: number;
    private pool: Array<T>;

    constructor(createObject: CreateObjectFunc<T>, options: PoolOptions = {}) {
        if (typeof createObject !== 'function') {
            throw new Error('createObject must be a function');
        }

        this.createObject = createObject;
        this.maxSize = options.maxSize || Number.MAX_SAFE_INTEGER;
        this.pool = [];

        // 预创建对象
        if (options.initialSize && options.initialSize > 0) {
            for (let i = 0; i < options.initialSize; i++) {
                this.recycle(this.createObject());
            }
        }
    }

    /**
     * 遍历池中的所有对象
     */
    forEach(callback: (value: T, index: number, array: T[]) => void): void {
        this.pool.forEach(callback);
    }

    /**
     * 获取一个对象
     */
    get(): T {
        return this.pool.length > 0 ? this.pool.pop()! : this.createObject();
    }

    /**
     * 回收一个对象
     */
    recycle(obj: T): boolean {
        if (obj == null) {
            return false;
        }

        if (this.pool.length >= this.maxSize) {
            return false;
        }

        this.pool.push(obj);
        return true;
    }

    /**
     * 获取池的当前大小
     */
    size(): number {
        return this.pool.length;
    }

    /**
     * 清空池
     */
    clear(): void {
        this.pool = [];
    }

    /**
     * 预热池，创建指定数量的对象
     */
    warmup(count: number): void {
        const toCreate = Math.min(count, this.maxSize - this.pool.length);
        for (let i = 0; i < toCreate; i++) {
            this.recycle(this.createObject());
        }
    }
}