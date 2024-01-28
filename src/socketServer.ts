import * as net from 'net';
import { Server as WebSocketServer } from 'ws';
import { config } from './config';
import { dataCtrl } from './dataCtrl';
import { actionType, heartBeatType, msgType } from './dataType';
import { eventSystem } from './eventSystem';
import { fileCtrl } from './fileCtrl';

export class socketServer {
    private static wss: WebSocketServer;

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
                this.wss.on('connection', socketServer.onSocketConnection.bind(socketServer));
                eventSystem.on('msgSaved', this.sendMsg.bind(this));
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


    static sendMsg(msg: msgType) {
        msg.action = 'add';
        this.wss.clients.forEach((client) => {
            client.send(JSON.stringify(msg));
        });
    }

    static selectAction(data: actionType | heartBeatType, ws: any) {
        switch (data.action) {
            case 'heartBeat':
                ws.send(JSON.stringify({ action: 'heartBeat', salt: data.salt }));
                break;
            case 'delete':
                dataCtrl.getMsgTypeByHash(data.fileOrTextHash!).then((msgType: msgType) => {
                    if (msgType.msgType === 'file') {
                        fileCtrl.deleteFile(msgType.url!);
                    }
                    dataCtrl.deleteMsg(data.fileOrTextHash!).then(() => {
                        eventSystem.emit('deleteItem', data.fileOrTextHash!);
                        this.wss.clients.forEach((client) => {
                            client.send(JSON.stringify(data));
                        });
                    });
                });
                break;
            case 'update':
                dataCtrl.getAllMsgs().then((msgs: msgType[]) => {
                    ws.send(JSON.stringify({ action: 'update', msgs: msgs }));
                });
                break;
        }
    }
}