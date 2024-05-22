import { ServerClientOperate, SocketMsg } from "../../common/CommonDefine";
import { EventMgr } from "../../common/EventMgr";
import { EventName, SocketEvent } from "../config/ClientDefine";
import { Config } from "../config/Config";

export class NetSocket {
    constructor() {

    }
    private socket: WebSocket | null;

    private lostConnectTimer: any;
    private lostConnectTime: number = 40000;

    private heartBeatTimer: any;
    private heartBeatTime: number = 30000;

    private reconnectTimer: any;
    private reconnectTimes: number = 4;
    private reconnectTime: number = 3000;

    private _lastActionTimestamp: number;


    get socketStatus() {
        return this.socket ? this.socket.readyState : -1;
    }




    private _onVisibilityChange(hide: boolean) {//手机浏览器切到后台可能会收到不消息，回来的时候刷新下。
        if (!hide) {
            this.tryRefresh();
        }
    }

    //--------------socket------------


    initSocket() {
        this.close();
        this.socket = new WebSocket(`ws://${Config.serverURL}:${Config.socketPort}`);
        EventMgr.emit(SocketEvent.onopening);
        this.addEvent();
    }



    private addEvent() {
        EventMgr.on(EventName.visibilitychange, this._onVisibilityChange, this);
        if (this.socket) {
            this.socket.addEventListener("message", this._onSocketMessage);
            this.socket.addEventListener("open", this._onSocketOpen);
            this.socket.addEventListener("close", this._onSocketClose);
            this.socket.addEventListener("error", this._onSocketError);
        }
    }

    private removeEvent() {
        EventMgr.off(EventName.visibilitychange, this._onVisibilityChange, this);
        if (this.socket) {
            this.socket.removeEventListener("message", this._onSocketMessage);
            this.socket.removeEventListener("open", this._onSocketOpen);
            this.socket.removeEventListener("close", this._onSocketClose);
            this.socket.removeEventListener("error", this._onSocketError);
        }
    }


    /**发送消息 */
    send(msg: string): number {
        let readyState = -1;
        if (this.socket) {
            readyState = this.socket.readyState;
            if (readyState == WebSocket.OPEN) {//懒得报错了，用户爱刷新就刷新
                this.socket.send(msg);
            }
        }
        return readyState;
    }

    /**关闭socket */
    close(sendCloseMsg: boolean = false) {
        this.removeEvent();
        if (this.socket) {
            if (this.socket.readyState != WebSocket.CLOSED && this.socket.readyState != WebSocket.CLOSING) {
                this.socket.close();
            }
            this.socket = null;
        }
        //手动发个消息出去
        if (sendCloseMsg) {
            EventMgr.emit(SocketEvent.onclose, true);
        }
    }


    private _onSocketMessage = (event: MessageEvent) => {
        let data: SocketMsg = JSON.parse(event.data);
        if (data.operate == ServerClientOperate.HEARTBEAT) {
            this.getHeartBeat(data);
        } else if (data.operate == ServerClientOperate.REFRESH) {
            this.getRefresh(data);
        } else if (data.operate == ServerClientOperate.ERROR) {
            console.warn(data.data);
            EventMgr.emit(SocketEvent.onerror, data.data);
        } else {
            this._lastActionTimestamp = data.timeStamp;
            EventMgr.emit(SocketEvent.onmessage, data);
        }
    }
    private _onSocketOpen = () => {
        this.resetConfig();
        this.sendHeartBeat();

        EventMgr.emit(SocketEvent.onopen);
    }
    private _onSocketClose = () => {
        EventMgr.emit(SocketEvent.onclose);
        this.tryReConnect();
    }
    private _onSocketError = (event: Event) => {
        console.warn(event);
        EventMgr.emit(SocketEvent.onerror);
    }

    //--------------手机浏览器且后台回来刷新----------------

    private tryRefresh() {
        let msg: SocketMsg = { operate: ServerClientOperate.REFRESH, timeStamp: Date.now() };
        this.send(JSON.stringify(msg));
    }

    private getRefresh(data: SocketMsg) {
        if (data.timeStamp != this._lastActionTimestamp) {
            console.warn("数据不一致，刷新");
            EventMgr.emit(SocketEvent.onopen);
        }
    }


    //--------------断线重连----------------


    private resetConfig() {
        this.reconnectTimer && clearTimeout(this.reconnectTimer);
        this.lostConnectTimer && clearTimeout(this.lostConnectTimer);
        this.heartBeatTimer && clearTimeout(this.heartBeatTimer);
        this.reconnectTimes = 4;
        this.lostConnectTime = 40000;
        this.heartBeatTime = 30000;
        this.reconnectTime = 3000;
    }

    private sendHeartBeat() {
        this.send(JSON.stringify({ operate: ServerClientOperate.HEARTBEAT, timeStamp: Date.now() }));
    }
    private getHeartBeat(data: SocketMsg) {
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

    private tryReConnect() {
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

