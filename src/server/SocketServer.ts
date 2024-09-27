import * as net from 'net';
import { WebSocketServer } from 'ws';
import { AddData, DeleteData, ErrorData, FullData, MsgData, ServerClientOperate, SocketMsg } from '../common/CommonDefine';
import { EventMgr } from '../common/EventMgr';
import { DatabaseOperation } from './DatabaseOperation';
import { FileOperation } from './FileOperation';
import { ServerConfig } from './ServerConfig';
import { EventName } from './ServerDefine';

export class SocketServer {
    private static wss: WebSocketServer;

    private static _lastMsgChangeTimestamp: number = 0;

    private static server: net.Server | null;//辅助用

    /**开启服务器 */
    static async startServer(port: number) {
        await new Promise((resolve, reject) => {
            this.server = net.createServer();
            this.server.once('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`端口${port}已被占用，尝试使用端口${port + 10}`);
                    resolve(SocketServer.startServer(port + 10));
                } else {
                    console.error(err);
                }
            });
            this.server.once('listening', this.initSocketServer.bind(this, port, resolve));
            this.server.listen(port);
        });
    }

    /**关闭socket服务器 */
    static closeSocketServer() {
        this.removeEvent();
        if (this.wss) {
            for (let i of this.wss.clients) {
                i.off("close", this.onWsClose.bind(this));
                i.off("message", this.onWsMsg.bind(this, i));
                i.off("error", this.onWsError.bind(this));
                i.close();
            }
        }
        this.wss?.close();
    }

    /**初始化socket服务器 */
    private static initSocketServer(port: number, resolve: any) {
        this.server?.close();
        this.server = null;
        if (!port || typeof port !== 'number') {
            throw new Error('端口号必须是数字');
        }
        this.wss = new WebSocketServer({ port: port });
        ServerConfig.socketPort = port;
        this._lastMsgChangeTimestamp = Date.now();
        this.addEvent();
        resolve();
        console.log("socket服务器已启动：");
        console.log(`ws://${ServerConfig.serverURL}:${port}`);
    }

    /**添加监听 */
    private static addEvent() {
        this.wss.on('connection', this.onSocketConnection.bind(this));
        EventMgr.on(EventName.ONMESSAGESAVED, this.onMessageSaved, this);
    }

    /**移除监听 */
    private static removeEvent() {
        this.wss?.off('connection', this.onSocketConnection);
        EventMgr.off(EventName.ONMESSAGESAVED, this.onMessageSaved, this);
    }
    /**消息保存 */
    private static onMessageSaved(msg: MsgData) {
        let data: AddData = { msg: msg };
        this._lastMsgChangeTimestamp = Date.now();
        let socketMsg: SocketMsg = { operate: ServerClientOperate.ADD, timeStamp: this._lastMsgChangeTimestamp, data: data };
        let str = JSON.stringify(socketMsg);
        this.wss.clients.forEach((client) => {
            client.send(str);
        });
    }
    /**socket连接 */
    private static onSocketConnection(ws: any) {
        ws.on('close', this.onWsClose.bind(this));
        ws.on('message', this.onWsMsg.bind(this, ws));
        ws.on('error', this.onWsError.bind(this));

    }

    /**socket关闭 */
    private static onWsClose() {
        // console.log('用户断开连接');
    }
    /**socket错误 */
    private static onWsError(err: any) {
        console.warn(err);
    }
    /**socket消息 */
    private static onWsMsg(ws: any, msg: string) {
        let socketMsg: SocketMsg = JSON.parse(msg);
        switch (socketMsg.operate) {
            case ServerClientOperate.HEARTBEAT:
                let heartBeat: SocketMsg = { operate: ServerClientOperate.HEARTBEAT, timeStamp: this._lastMsgChangeTimestamp };
                ws.send(JSON.stringify(heartBeat));
                break;
            case ServerClientOperate.DELETE:
                let fileOrTextHash: string = socketMsg.data.fileOrTextHash;
                DatabaseOperation.getMsgDataByHash(fileOrTextHash).then((deleteMsg: MsgData) => {
                    if (deleteMsg != null && deleteMsg.msgType != null) {//防止重复删除
                        if (deleteMsg.msgType === 'file') {
                            FileOperation.deleteFile(deleteMsg.url!);
                        }
                        DatabaseOperation.deleteFromDatabase(fileOrTextHash).then(() => {
                            EventMgr.emit(EventName.DELETEITEM, fileOrTextHash);
                            this._lastMsgChangeTimestamp = Date.now();
                            let data: DeleteData = { fileOrTextHash: fileOrTextHash };
                            let socketMsg: SocketMsg = { operate: ServerClientOperate.DELETE, timeStamp: this._lastMsgChangeTimestamp, data: data };
                            let str = JSON.stringify(socketMsg);
                            this.wss.clients.forEach((client) => {
                                client.send(str);
                            });
                        });
                    }
                });
                break;
            case ServerClientOperate.FULL:
                DatabaseOperation.getAllMsgs().then((msgs: MsgData[]) => {
                    let data: FullData = { msgs: msgs };
                    let socketMsg: SocketMsg = { operate: ServerClientOperate.FULL, timeStamp: this._lastMsgChangeTimestamp, data: data };
                    ws.send(JSON.stringify(socketMsg));
                });
                break;
            case ServerClientOperate.REFRESH:
                let data: SocketMsg = { operate: ServerClientOperate.REFRESH, timeStamp: this._lastMsgChangeTimestamp };
                ws.send(JSON.stringify(data));
                break;
            default:
                let msg = "未知的operate:" + socketMsg.operate;
                let errData: ErrorData = { error: msg };
                let err: SocketMsg = { operate: ServerClientOperate.ERROR, timeStamp: this._lastMsgChangeTimestamp, data: errData };
                ws.send(JSON.stringify(err));
                break;
        }
    }
}