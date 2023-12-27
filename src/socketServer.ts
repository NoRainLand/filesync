import { Server as WebSocketServer } from 'ws';
import { config } from './config';
import { dataCtrl } from './dataCtrl';
import { actionType, msgType } from './dataType';
import { eventSystem } from './eventSystem';
import { fileCtrl } from './fileCtrl';

export class socketServer {
    private static wss: WebSocketServer;

    constructor() {

    }

    static startSocketServer(port: number) {
        console.log(`SocketServer is running on ws://${config.URL}:${port}`);
        this.wss = new WebSocketServer({ port: port });
        this.wss.on('connection', (ws) => {
            console.log('A user connected');

            ws.on('close', () => {
                console.log('A user disconnected');
            });

            ws.on('message', (message: string) => {
                let data = JSON.parse(message);
                this.selectAction(data, ws);

            });
        });
        eventSystem.on('msgSaved', this.sendMsg.bind(this));
    }

    static sendMsg(msg: msgType) {
        msg.action = 'add';
        this.wss.clients.forEach((client) => {
            client.send(JSON.stringify(msg));
        });
    }

    static selectAction(data: actionType, ws: any) {
        switch (data.action) {
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