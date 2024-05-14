import { Config } from "./Config";
import { socketEventType, SocketMsgType } from "./DataType";
import { EventSystem } from "./EventSystem";

export class SocketMgr {
    constructor() {

    }
    private static socket: WebSocket | null;

    private static lostConnectTimer: any;
    private static lostConnectTime: number = 40000;

    private static heartBeatTimer: any;
    private static heartBeatTime: number = 30000;

    private static reconnectTimer: any;
    private static reconnectTimes: number = 4;
    private static reconnectTime: number = 3000;

    private static _lastActionTimestamp: number;

    private static isInit: boolean = false;

    private static init() {
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        this.resetConfig();
        EventSystem.on("visibilitychange", this._onVisibilityChange.bind(this));
    }


    private static _onVisibilityChange(hide: boolean) {//手机浏览器切到后台可能会收到不消息，回来的时候刷新下。
        if (!hide) {
            this.tryRefresh();
        }
    }

    //--------------socket------------


    static initSocket() {
        this.close();
        this.init();
        this.socket = new WebSocket(`ws://${Config.URL}:${Config.SocketIOPORT}`);
        this.socket.onmessage = this._onSocketMessage.bind(this);
        this.socket.onopen = this._onSocketOpen.bind(this);
        this.socket.onclose = this._onSocketClose.bind(this);
        this.socket.onerror = this._onSocketError.bind(this);
    }
    static send(msg: string): number {
        let readyState = -1;
        if (this.socket) {
            readyState = this.socket.readyState;
            if (this.socket.readyState == WebSocket.OPEN) {//懒得报错了，用户爱刷新就刷新
                this.socket.send(msg);
            }
        }
        return readyState;
    }
    static close(sendCloseMsg: boolean = false) {
        if (this.socket) {
            this.socket.onmessage = null;
            this.socket.onopen = null;
            this.socket.onclose = null;
            this.socket.onerror = null;
            if (this.socket.readyState != WebSocket.CLOSED && this.socket.readyState != WebSocket.CLOSING) {
                this.socket.close();
            }
            this.socket = null;
        }
        //手动发个消息出去
        if (sendCloseMsg) {
            this._onSocketEvent({ event: "onclose", data: false });
        }
    }
    private static _onSocketMessage(event: MessageEvent) {
        let data: SocketMsgType = JSON.parse(event.data);
        if (data.action == "heartBeat") {
            this.getHeartBeat(data);
        } else if (data.action == "refresh") {
            this.getRefresh(data);
        } else if (data.action == "error") {
            EventSystem.emit("socketEvent", { event: "onerror", data: data.data });
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
        // this._onSocketEvent({ event: "onerror", data: event });
    }

    private static _onSocketEvent(msg: socketEventType) {
        EventSystem.emit("socketEvent", msg);
    }
    //--------------手机浏览器且后台回来刷新----------------

    private static tryRefresh() {
        let data: SocketMsgType = { action: "refresh" };
        this.send(JSON.stringify(data));
    }

    private static getRefresh(data: SocketMsgType) {
        if (data.timeStamp != this._lastActionTimestamp) {
            console.warn("数据不一致，刷新");
            this._onSocketEvent({ event: "onopen", data: null });
        }
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
    }

    private static sendHeartBeat() {
        this.send(JSON.stringify({ action: "heartBeat" }));
    }
    private static getHeartBeat(data: SocketMsgType) {
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
            this.close(true);
        }
    }

}