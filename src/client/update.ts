import { handler } from "./handler";

export class update {
    private static _handlers: handler[] = [];
    private static _lastTime: number;
    private static _isStartLoop: boolean = false;
    private static _loop() {
        let now = Date.now();
        let dt = now - this._lastTime;
        this._lastTime = now;
        for (let i = 0; i < this._handlers.length; i++) {
            let handler = this._handlers[i];
            if (handler && handler.isRecover == false) {
                handler.runWith(dt);
            } else {
                this._handlers.splice(i, 1);
                i--;
            }
        }
        window.requestAnimationFrame(this._loop);
    }
    static addUpdate(caller: any, update: (dt: number) => void) {
        if (!this._isStartLoop) {
            this._isStartLoop = true;
            this._lastTime = Date.now();
            window.requestAnimationFrame(this._loop.bind(this));
        }
        let hd = handler.createHandler(caller, update, false)
        this._handlers.push(hd);
    }
}


