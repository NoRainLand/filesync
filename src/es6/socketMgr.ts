import { config } from "./config";
import { socketEventType, socketMsgType } from "./dataType";
import { eventSystem } from "./eventSystem";

export class socketMgr {
    constructor() {

    }
    private static socket: WebSocket;

    private static lostConnectTimer: any;
    private static lostConnectTime: number = 40000;

    private static heartBeatTimer: any;
    private static heartBeatTime: number = 30000;

    private static reconnectTimer: any;
    private static reconnectTimes: number = 4;
    private static reconnectTime: number = 3000;

    private static _lastActionTimestamp: number;

    private static lastHeartBeatTime: number = 0;

    private static isInit: boolean = false;

    private static init() {
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        eventSystem.on("visibilitychange", this._onVisibilityChange.bind(this));
    }

    static initSocket() {
        this.init();
        this.socket = new WebSocket(`ws://${config.URL}:${config.SocketIOPORT}`);
        this.socket.onmessage = this._onSocketMessage.bind(this);
        this.socket.onopen = this._onSocketOpen.bind(this);
        this.socket.onclose = this._onSocketClose.bind(this);
        this.socket.onerror = this._onSocketError.bind(this);
    }
    static send(msg: string) {
        this.socket?.send(msg);
    }
    static close() {
        this.resetConfig();
        this.socket?.close();
    }
    private static _onSocketMessage(event: MessageEvent) {
        let data: socketMsgType = JSON.parse(event.data);
        if (data.action == "heartBeat") {
            this.getHeartBeat(data);
        } else {
            this._lastActionTimestamp = data.timeStamp!;
            this._onSocketEvent({ event: "onmessage", data })
        }
    }
    private static _onSocketOpen() {
        this.resetConfig();
        this._onSocketEvent({ event: "onopen", data: null });
        this.sendHeartBeat();
    }
    private static _onSocketClose() {
        this._onSocketEvent({ event: "onclose", data: true });
        this.tryReConnect();
    }
    private static _onSocketError(event: Event) {
        console.warn(event);
        this._onSocketEvent({ event: "onerror", data: event });
    }

    private static _onSocketEvent(msg: socketEventType) {
        eventSystem.emit("socketEvent", msg);
    }

    //--------------断线重连----------------

    private static resetConfig() {
        this.reconnectTimer && clearTimeout(this.reconnectTimer);
        this.lostConnectTimer && clearTimeout(this.lostConnectTimer);
        this.heartBeatTimer && clearTimeout(this.heartBeatTimer);
        this.reconnectTimes = 4;
        this.lostConnectTime = 40000;
        this.heartBeatTime = 30000;
        this.reconnectTime = 3000;
        this._lastActionTimestamp = Date.now();
    }

    private static sendHeartBeat() {
        this.lastHeartBeatTime = Date.now();
        this._lastActionTimestamp = Date.now();
        this.send(JSON.stringify({ action: "heartBeat" }));
    }
    private static getHeartBeat(data: socketMsgType) {
        if (data.action == "heartBeat") {
            this.lostConnectTimer && clearTimeout(this.lostConnectTimer);
            this.heartBeatTimer && clearTimeout(this.heartBeatTimer);
            let self = this;
            this.heartBeatTimer = setTimeout(() => {
                self.sendHeartBeat();
            }, this.heartBeatTime);
            this.lostConnectTimer = setTimeout(() => {
                self.tryReConnect();
            }, this.lostConnectTime);
        }
    }

    private static tryReConnect() {
        this.lostConnectTimer && clearTimeout(this.lostConnectTimer);
        this.heartBeatTimer && clearTimeout(this.heartBeatTimer);
        this.reconnectTimer && clearTimeout(this.reconnectTimer);
        let self = this;
        if (this.reconnectTimes > 0) {
            this.reconnectTimes--;
            this.initSocket();
            this.reconnectTimer = setTimeout(() => {
                self.tryReConnect();
            }, this.reconnectTime);
        } else {
            this._onSocketEvent({ event: "onclose", data: false });
        }
    }


    private static _onVisibilityChange(isHide: boolean) {
        if (!isHide) {
            let now = Date.now();
            if (now - this.lastHeartBeatTime > this.lostConnectTime) {
                // this.close();
                this.tryReConnect();
            } else {

            }
        }
    }



}