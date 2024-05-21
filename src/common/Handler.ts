import { Pool } from "./Pool";

export class Handler {

    static createHandler(caller: any, callback: Function, isOnce: boolean = true): Handler {
        let hd = this.getHandler();
        hd = this.setHandler(caller, callback, hd, isOnce);
        return hd;
    }
    private static pool: Pool<Handler> = new Pool<Handler>(() => new Handler());
    static getHandler(): Handler {
        let hd = this.pool.get();
        hd._isRecover = false;
        return hd;
    }
    static setHandler(caller: any, callback: Function, handler: Handler, isOnce: boolean = true) {
        handler._caller = caller;
        handler._callback = callback;
        handler._isOnce = isOnce;
        return handler;
    }
    static recoverHandler(handler: Handler) {
        if (handler && handler instanceof Handler && handler.isRecover == false) {
            handler._reset();
            this.pool.recycle(handler);
        }
    }


    //------self------

    private _reset() {
        this._caller = null;
        this._callback = null;
        this._isOnce = true;
        this._isRecover = true;
    }
    private _caller: any;
    private _callback: Function | null;
    private _isOnce: boolean = true;
    private _isRecover: boolean = true;
    get isOnce() {
        return this._isOnce;
    }
    get isRecover() {
        return this._isRecover;
    }
    run() {
        if (!this._isRecover) {
            this._callback?.call(this._caller);
            if (this._isOnce) {
                Handler.recoverHandler(this);
            }
        }
    }
    runWith(parms: any) {
        if (!this._isRecover) {
            this._callback?.apply(this._caller, parms);
            if (this._isOnce) {
                Handler.recoverHandler(this);
            }
        }
    }

    isMe(caller: any, callback: Function) {
        return this._caller == caller && this._callback == callback;
    }

    isCaller(caller: any) {
        return this._caller == caller;
    }
}