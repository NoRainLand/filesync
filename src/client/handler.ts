export class Handler {

    static createHandler(caller: any, callback: Function, isOnce: boolean = true): Handler {
        let hd = this.getHandler();
        hd._caller = caller;
        hd._callback = callback;
        hd._isOnce = isOnce;
        return hd;
    }
    private static _poor: Handler[] = [];
    private static getHandler(): Handler {
        if (this._poor.length > 0) {
            let hd = this._poor.pop()!;
            hd._isRecover = false;
            return hd;
        } else {
            let hd = new Handler();
            hd._isRecover = false;
            return hd;
        }
    }
    static recoverdHandler(handler: Handler) {
        if (handler) {
            handler._reset();
            this._poor.push(handler);
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
                Handler.recoverdHandler(this);
            }
        }
    }
    runWith(parms: any) {
        if (!this._isRecover) {
            this._callback?.call(this._caller, parms);
            if (this._isOnce) {
                Handler.recoverdHandler(this);
            }
        }
    }
}