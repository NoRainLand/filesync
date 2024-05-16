
import { Handler } from "./Handler";

/**事件管理器 */
export class EventMgr {
    private static eventMap: Map<string, Handler[]> = new Map();

    static on(event: string, callback: Function, caller: any) {
        let arr: Handler[];
        if (!this.eventMap.has(event)) {
            this.eventMap.set(event, []);
        }
        arr = this.eventMap.get(event) as Handler[];
        let hd = Handler.createHandler(caller, callback, false);
        arr.push(hd);
        this.eventMap.set(event, arr);
    }

    static once(event: string, callback: Function, caller: any) {
        let arr: Handler[];
        if (!this.eventMap.has(event)) {
            this.eventMap.set(event, []);
        }
        arr = this.eventMap.get(event) as Handler[];
        let hd = Handler.createHandler(caller, callback, true);
        arr.push(hd);
        this.eventMap.set(event, arr);
    }

    static off(event: string, callback: Function, caller: any) {
        if (this.eventMap.has(event)) {
            let arr = this.eventMap.get(event)!;
            for (let i = 0; i < arr.length; i++) {
                let hd = arr[i];
                if (hd.isMe(caller, callback)) {
                    arr.splice(i, 1);
                    i--;
                    Handler.recoverHandler(hd);
                }
            }
        }
    }

    static offAll(caller: any) {
        this.eventMap.forEach((value, key) => {
            for (let i = 0; i < value.length; i++) {
                let hd = value[i];
                if (hd.isCaller(caller)) {
                    value.splice(i, 1);
                    i--;
                    Handler.recoverHandler(hd);
                }
            }
        });
    }

    static offAllEvent(event: string) {
        if (this.eventMap.has(event)) {
            let arr = this.eventMap.get(event)!;
            for (let i = 0; i < arr.length; i++) {
                let hd = arr[i];
                Handler.recoverHandler(hd);
            }
            this.eventMap.delete(event);
        }
    }

    static offAllEvents() {
        this.eventMap.forEach((value, key) => {
            for (let i = 0; i < value.length; i++) {
                let hd = value[i];
                Handler.recoverHandler(hd);
            }
        });
        this.eventMap.clear();
    }

    static emit(event: string, ...args: any[]) {
        if (this.eventMap.has(event)) {
            let arr = this.eventMap.get(event)!;
            for (let i = 0; i < arr.length; i++) {
                let hd = arr[i];
                hd.runWith(args);
                if (hd.isOnce) {
                    arr.splice(i, 1);
                    i--;
                    Handler.recoverHandler(hd);
                }
            }
        }
    }
}