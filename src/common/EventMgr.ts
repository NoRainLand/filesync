import { Handler } from "./Handler";

/**
 * 事件管理器
 * 用于管理全局事件的订阅、发布和注销
 */
export class EventMgr {
    private static readonly eventMap = new Map<string, Handler[]>();

    /**
     * 订阅事件
     * @param event 事件名
     * @param callback 回调函数
     * @param caller 调用者
     */
    static on(event: string, callback: Function, caller: any): void {
        const handlers = this.eventMap.get(event) || [];
        if (!this.eventMap.has(event)) {
            this.eventMap.set(event, handlers);
        }
        handlers.push(Handler.createHandler(caller, callback, false));
    }

    /**
     * 订阅一次性事件
     * @param event 事件名
     * @param callback 回调函数
     * @param caller 调用者
     */
    static once(event: string, callback: Function, caller: any): void {
        const handlers = this.eventMap.get(event) || [];
        if (!this.eventMap.has(event)) {
            this.eventMap.set(event, handlers);
        }
        handlers.push(Handler.createHandler(caller, callback, true));
    }

    /**
     * 取消特定事件订阅
     * @param event 事件名
     * @param callback 回调函数
     * @param caller 调用者
     */
    static off(event: string, callback: Function, caller: any): void {
        const handlers = this.eventMap.get(event);
        if (!handlers) return;

        for (let i = handlers.length - 1; i >= 0; i--) {
            const handler = handlers[i];
            if (handler.isMe(caller, callback)) {
                handlers.splice(i, 1);
                Handler.recoverHandler(handler);
            }
        }
    }

    /**
     * 取消调用者的所有事件订阅
     * @param caller 调用者
     */
    static offAll(caller: any): void {
        this.eventMap.forEach(handlers => {
            for (let i = handlers.length - 1; i >= 0; i--) {
                const handler = handlers[i];
                if (handler.isCaller(caller)) {
                    handlers.splice(i, 1);
                    Handler.recoverHandler(handler);
                }
            }
        });
    }

    /**
     * 取消指定事件的所有订阅
     * @param event 事件名
     */
    static offAllEvent(event: string): void {
        const handlers = this.eventMap.get(event);
        if (handlers) {
            handlers.forEach(handler => Handler.recoverHandler(handler));
            this.eventMap.delete(event);
        }
    }

    /**
     * 取消所有事件订阅
     */
    static offAllEvents(): void {
        this.eventMap.forEach(handlers => {
            handlers.forEach(handler => Handler.recoverHandler(handler));
        });
        this.eventMap.clear();
    }

    /**
     * 触发事件
     * @param event 事件名
     * @param args 事件参数
     */
    static emit(event: string, ...args: any[]): void {
        const handlers = this.eventMap.get(event);
        if (!handlers) return;

        for (let i = handlers.length - 1; i >= 0; i--) {
            const handler = handlers[i];
            handler.runWith(args);
            if (handler.isOnce) {
                handlers.splice(i, 1);
                Handler.recoverHandler(handler);
            }
        }
    }
}