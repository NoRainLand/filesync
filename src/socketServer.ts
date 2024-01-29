import * as net from 'net';
import { Server as WebSocketServer } from 'ws';
import { config } from './config';
import { dataCtrl } from './dataCtrl';
import { actionAddType, actionDelteType, actionFullMsgType, msgType, socketMsgType } from './dataType';
import { eventSystem } from './eventSystem';
import { fileCtrl } from './fileCtrl';

export class socketServer {
    private static wss: WebSocketServer;

    private static _lastActionTimestamp: number = 0;

    constructor() {

    }

    static startSocketServer(port: number) {
        return new Promise((resolve, reject) => {
            const server = net.createServer();
            server.once('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`端口${port}已被占用，尝试使用端口${port + 10}`);
                    resolve(socketServer.startSocketServer(port + 10));
                } else {
                    reject(err);
                }
            });
            server.once('listening', () => {
                server.close();
                this.wss = new WebSocketServer({ port: port });
                config.SocketIOPORT = port;
                console.log("socket服务器已启动：");
                console.log(`ws://${config.URL}:${port}`);
                this._lastActionTimestamp = Date.now();
                this.wss.on('connection', socketServer.onSocketConnection.bind(socketServer));
                eventSystem.on('msgSaved', this.sendSaveMsg.bind(this));
                resolve(true);
            });
            server.listen(port);
        });
    }

    static onSocketConnection(ws: any) {
        ws.on('close', () => {
            console.log('A user disconnected');
        });

        ws.on('message', (message: string) => {
            let data = JSON.parse(message);
            this.selectAction(data, ws);
        });
    }


    static sendSaveMsg(msg: msgType) {
        let data: actionAddType = { msg: msg };
        this._lastActionTimestamp = Date.now();
        let socketMsg: socketMsgType = { action: 'add', timeStamp: this._lastActionTimestamp, data: data };
        let str = JSON.stringify(socketMsg);
        this.wss.clients.forEach((client) => {
            client.send(str);
        });
    }

    static selectAction(socketMsgFromClient: socketMsgType, ws: any) {
        switch (socketMsgFromClient.action) {
            case 'heartBeat':
                ws.send(JSON.stringify({ action: 'heartBeat', timeStamp: Date.now() }));
                break;
            case 'delete':
                let fileOrTextHash: string = socketMsgFromClient.data!;
                dataCtrl.getMsgTypeByHash(fileOrTextHash).then((msgType: msgType) => {
                    if (msgType != null && msgType.msgType != null) {//防止重复删除
                        if (msgType.msgType === 'file') {
                            fileCtrl.deleteFile(msgType.url!);
                        }
                        dataCtrl.deleteMsg(fileOrTextHash).then(() => {
                            eventSystem.emit('deleteItem', fileOrTextHash);
                            this._lastActionTimestamp = Date.now();
                            let data: actionDelteType = { fileOrTextHash: fileOrTextHash };
                            let socketMsg: socketMsgType = { action: 'delete', timeStamp: this._lastActionTimestamp, data: data };
                            let str = JSON.stringify(socketMsg);
                            this.wss.clients.forEach((client) => {
                                client.send(str);
                            });
                        });
                    }
                });
                break;
            case 'full':
                dataCtrl.getAllMsgs().then((msgs: msgType[]) => {
                    let data: actionFullMsgType = { msgs: msgs };
                    let socketMsg: socketMsgType = { action: 'full', timeStamp: this._lastActionTimestamp, data: data };
                    ws.send(JSON.stringify(socketMsg));
                });
                break;
            case "refresh":
                let data: socketMsgType = { action: "refresh", timeStamp: this._lastActionTimestamp };
                ws.send(JSON.stringify(data));
                break;
        }
    }
}