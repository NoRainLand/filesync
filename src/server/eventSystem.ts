import { EventEmitter } from 'events';
import { eventType } from './dataType';

export class eventSystem {
    private static _eventEmitter: EventEmitter;
    static get eventEmitter(): EventEmitter {
        if (!this._eventEmitter) {
            this._eventEmitter = new EventEmitter();
        }
        return this._eventEmitter;
    }

    static on(event: eventType, listener: (...args: any[]) => void): void {
        this.eventEmitter.on(event, listener);
    }

    static once(event: eventType, listener: (...args: any[]) => void): void {
        this.eventEmitter.once(event, listener);
    }

    static off(event: eventType, listener: (...args: any[]) => void): void {
        this.eventEmitter.off(event, listener);
    }

    static emit(event: eventType, ...args: any[]): void {
        this.eventEmitter.emit(event, ...args);
    }
}