import { Pool } from "./Pool";

/**
 * 处理器类，用于管理回调函数的执行
 */
export class Handler {
    private static readonly pool: Pool<Handler> = new Pool<Handler>(() => new Handler());

    private _caller: unknown = null;
    private _callback: Function | null = null;
    private _isOnce: boolean = true;
    private _isRecover: boolean = true;

    /**
     * 创建一个新的处理器
     */
    static createHandler(caller: unknown, callback: Function, isOnce: boolean = true): Handler {
        if (typeof callback !== 'function') {
            throw new Error('callback must be a function');
        }

        const handler = this.getHandler();
        return this.setHandler(caller, callback, handler, isOnce);
    }

    /**
     * 从对象池获取一个处理器
     */
    private static getHandler(): Handler {
        const handler = this.pool.get();
        handler._isRecover = false;
        return handler;
    }

    /**
     * 设置处理器的属性
     */
    private static setHandler(
        caller: unknown,
        callback: Function,
        handler: Handler,
        isOnce: boolean = true
    ): Handler {
        handler._caller = caller;
        handler._callback = callback;
        handler._isOnce = isOnce;
        return handler;
    }

    /**
     * 回收处理器到对象池
     */
    static recoverHandler(handler: Handler): void {
        if (!(handler instanceof Handler) || handler.isRecover) {
            return;
        }

        handler._reset();
        this.pool.recycle(handler);
    }

    /**
     * 重置处理器状态
     */
    private _reset(): void {
        this._caller = null;
        this._callback = null;
        this._isOnce = true;
        this._isRecover = true;
    }

    /**
     * 获取是否为一次性处理器
     */
    get isOnce(): boolean {
        return this._isOnce;
    }

    /**
     * 获取是否已被回收
     */
    get isRecover(): boolean {
        return this._isRecover;
    }

    /**
     * 执行处理器
     */
    run(): void {
        if (this._isRecover || !this._callback) {
            return;
        }

        try {
            this._callback.call(this._caller);
        } catch (error) {
            console.error('Error in handler execution:', error);
        } finally {
            if (this._isOnce) {
                Handler.recoverHandler(this);
            }
        }
    }

    /**
     * 使用参数执行处理器
     */
    runWith(params: unknown[]): void {
        if (this._isRecover || !this._callback) {
            return;
        }

        try {
            this._callback.apply(this._caller, params);
        } catch (error) {
            console.error('Error in handler execution with params:', error);
        } finally {
            if (this._isOnce) {
                Handler.recoverHandler(this);
            }
        }
    }

    /**
     * 检查是否为指定的调用者和回调
     */
    isMe(caller: unknown, callback: Function): boolean {
        return this._caller === caller && this._callback === callback;
    }

    /**
     * 检查是否为指定的调用者
     */
    isCaller(caller: unknown): boolean {
        return this._caller === caller;
    }
}