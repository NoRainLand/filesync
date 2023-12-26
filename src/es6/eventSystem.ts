import { eventType } from "./dataType";

type Callback = (...args: any[]) => void;

export class eventSystem {
    private static _events: { [key: string]: Callback[] } = {};
    private static get events() {
        return this._events;
    }
    static on(eventName: eventType, callback: Callback): void {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    static emit(eventName: eventType, ...args: any[]): void {
        const callbacks = this.events[eventName];
        if (callbacks) {
            callbacks.forEach(callback => callback(...args));
        }
    }

    static off(eventName: eventType, callback: Callback): void {
        const callbacks = this.events[eventName];
        if (callbacks) {
            this.events[eventName] = callbacks.filter(cb => cb !== callback);
        }
    }
}