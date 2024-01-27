import { config } from "./config";

export class socketMgr {
    constructor() {

    }
    private static socket: WebSocket;
    private static _onSocketOpen: Function;
    private static _onSocketClose: Function;
    private static _onSocketMessage: Function;
    private static maxReconnectAttempts = 3;
    private static reconnectAttempts = 0;
    private static reconnectInterval = 3000;
    private static socketTimer: any;

    private static lostConnectTime: number = 40000;
    private static heartBeatTime: number = 30000;
    private static heartBeatTimer: any;
    private static reconnectTimes: number = 4;
    private static reconnectTime: number = 3000;


    static initSocket(onSocketMessage?: Function, onSocketOpen?: Function, onSocketClose?: Function) {
        this._onSocketMessage = onSocketMessage || this._onSocketMessage;
        this._onSocketOpen = onSocketOpen || this._onSocketOpen;
        this._onSocketClose = onSocketClose || this._onSocketClose;
        this.socket = new WebSocket(`ws://${config.URL}:${config.SocketIOPORT}`);
        this.socket.onmessage = (event) => {
            this._onSocketMessage?.(event);
        }
        this.socket.onopen = () => {
            this._onSocketOpen?.();
            this.reconnectAttempts = 0;
            if (this.socketTimer) {
                clearInterval(this.socketTimer);
            }
        }
        this.socket.onclose = () => {
            setTimeout(() => {
                if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    this._onSocketClose?.(false);
                    console.warn("服务器已关闭");
                } else {
                    this._onSocketClose?.(true);
                    this.initSocket();
                    this.reconnectAttempts++;
                }
            }, this.reconnectInterval);
        }

    }
    static send(msg: string) {
        this.socket?.send(msg);
    }



    static onSocketOpen() {

    }

    static tryReConnect() {

    }


}