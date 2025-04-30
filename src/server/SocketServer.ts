import * as net from 'net';
import { WebSocket, WebSocketServer } from 'ws';
import { AddData, DeleteData, ErrorData, FullData, MsgData, ServerClientOperate, SocketMsg } from '../common/CommonDefine';
import { EventMgr } from '../common/EventMgr';
import { DatabaseOperation } from './DatabaseOperation';
import { FileOperation } from './FileOperation';
import { ServerConfig } from './ServerConfig';
import { EventName } from './ServerDefine';

export class SocketServer {
    private static wss: WebSocketServer;
    private static server: net.Server | null;
    private static isRunning: boolean = false;
    private static _lastMsgChangeTimestamp: number = 0;

    /**
     * 启动服务器
     */
    static async startServer(port: number): Promise<void> {
        if (this.isRunning) {
            console.warn('WebSocket 服务器已经在运行中');
            return;
        }

        try {
            await this.initializeServer(port);
            this.isRunning = true;
            console.log(`WebSocket 服务器已启动: ws://${ServerConfig.serverIp}:${port}`);
        } catch (error) {
            console.error('启动 WebSocket 服务器失败:', error);
            throw error;
        }
    }

    /**
     * 停止服务器
     */
    static async stop(): Promise<void> {
        if (!this.isRunning) {
            return;
        }

        return new Promise((resolve, reject) => {
            try {
                this.closeAllConnections();
                this.wss?.close((err) => {
                    if (err) {
                        console.error('关闭 WebSocket 服务器出错:', err);
                        reject(err);
                        return;
                    }
                    this.isRunning = false;
                    console.log('WebSocket 服务器已安全关闭');
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 初始化服务器
     */
    private static async initializeServer(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server = net.createServer();

            this.server.once('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    const newPort = port + 10;
                    console.warn(`端口 ${port} 已被占用，尝试使用端口 ${newPort}`);
                    this.startServer(newPort).then(resolve).catch(reject);
                } else {
                    reject(err);
                }
            });

            this.server.once('listening', () => {
                this.setupWebSocketServer(port);
                resolve();
            });

            this.server.listen(port);
        });
    }

    /**
     * 设置 WebSocket 服务器
     */
    private static setupWebSocketServer(port: number): void {
        this.server?.close();
        this.server = null;

        if (!port || typeof port !== 'number') {
            throw new Error('端口号必须是数字');
        }

        this.wss = new WebSocketServer({ port });
        ServerConfig.socketPort = port;
        this._lastMsgChangeTimestamp = Date.now();
        this.addEvent();
    }

    /**
     * 添加事件监听
     */
    private static addEvent(): void {
        this.wss.on('connection', this.onSocketConnection.bind(this));
        EventMgr.on(EventName.ONMESSAGESAVED, this.onMessageSaved, this);
    }

    /**
     * 移除事件监听
     */
    private static removeEvent(): void {
        this.wss?.off('connection', this.onSocketConnection);
        EventMgr.off(EventName.ONMESSAGESAVED, this.onMessageSaved, this);
    }

    /**
     * 关闭所有连接
     */
    private static closeAllConnections(): void {
        if (!this.wss) return;

        this.removeEvent();
        for (const client of this.wss.clients) {
            this.removeClientListeners(client);
            client.close();
        }
    }

    /**
     * 移除客户端监听器
     */
    private static removeClientListeners(client: WebSocket): void {
        client.off("close", this.onWsClose);
        client.off("message", this.onWsMsg);
        client.off("error", this.onWsError);
    }

    /**
     * Socket 连接处理
     */
    private static onSocketConnection(ws: WebSocket): void {
        ws.on('close', this.onWsClose);
        ws.on('message', (msg) => this.onWsMsg(ws, msg.toString()));
        ws.on('error', this.onWsError);
    }

    /**
     * Socket 关闭处理
     */
    private static onWsClose(): void {
        // console.log('客户端断开连接');
    }

    /**
     * Socket 错误处理
     */
    private static onWsError(error: Error): void {
        console.warn('WebSocket 错误:', error);
    }

    /**
     * 消息保存处理
     */
    private static onMessageSaved(msg: MsgData): void {
        const data: AddData = { msg };
        this._lastMsgChangeTimestamp = Date.now();
        const socketMsg: SocketMsg = {
            operate: ServerClientOperate.ADD,
            timeStamp: this._lastMsgChangeTimestamp,
            data
        };
        this.broadcastMessage(socketMsg);
    }

    /**
     * 广播消息给所有客户端
     */
    private static broadcastMessage(socketMsg: SocketMsg): void {
        const message = JSON.stringify(socketMsg);
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    /**
     * 处理 WebSocket 消息
     */
    private static async onWsMsg(ws: WebSocket, message: string): Promise<void> {
        try {
            const socketMsg: SocketMsg = JSON.parse(message);
            await this.handleSocketMessage(ws, socketMsg);
        } catch (error) {
            console.error('处理 WebSocket 消息时出错:', error);
            this.sendErrorResponse(ws, '消息处理失败');
        }
    }

    /**
     * 处理 Socket 消息类型
     */
    private static async handleSocketMessage(ws: WebSocket, socketMsg: SocketMsg): Promise<void> {
        switch (socketMsg.operate) {
            case ServerClientOperate.HEARTBEAT:
                await this.handleHeartbeat(ws);
                break;
            case ServerClientOperate.DELETE:
                await this.handleDelete(socketMsg.data.fileOrTextHash);
                break;
            case ServerClientOperate.FULL:
                await this.handleFull(ws);
                break;
            case ServerClientOperate.REFRESH:
                await this.handleRefresh(ws);
                break;
            default:
                this.sendErrorResponse(ws, `未知的操作: ${socketMsg.operate}`);
        }
    }

    /**
     * 处理心跳消息
     */
    private static async handleHeartbeat(ws: WebSocket): Promise<void> {
        const heartBeat: SocketMsg = {
            operate: ServerClientOperate.HEARTBEAT,
            timeStamp: this._lastMsgChangeTimestamp
        };
        ws.send(JSON.stringify(heartBeat));
    }

    /**
     * 处理删除操作
     */
    private static async handleDelete(fileOrTextHash: string): Promise<void> {
        const deleteMsg = await DatabaseOperation.getMsgDataByHash(fileOrTextHash);
        if (!deleteMsg?.msgType) return;

        if (deleteMsg.msgType === 'file') {
            await FileOperation.deleteFile(deleteMsg.url!);
        }

        await DatabaseOperation.deleteFromDatabase(fileOrTextHash);
        EventMgr.emit(EventName.DELETEITEM, fileOrTextHash);

        this._lastMsgChangeTimestamp = Date.now();
        const socketMsg: SocketMsg = {
            operate: ServerClientOperate.DELETE,
            timeStamp: this._lastMsgChangeTimestamp,
            data: { fileOrTextHash }
        };
        this.broadcastMessage(socketMsg);
    }

    /**
     * 处理全量数据请求
     */
    private static async handleFull(ws: WebSocket): Promise<void> {
        const msgs = await DatabaseOperation.getAllMsgs();
        const socketMsg: SocketMsg = {
            operate: ServerClientOperate.FULL,
            timeStamp: this._lastMsgChangeTimestamp,
            data: { msgs }
        };
        ws.send(JSON.stringify(socketMsg));
    }

    /**
     * 处理刷新请求
     */
    private static async handleRefresh(ws: WebSocket): Promise<void> {
        const socketMsg: SocketMsg = {
            operate: ServerClientOperate.REFRESH,
            timeStamp: this._lastMsgChangeTimestamp
        };
        ws.send(JSON.stringify(socketMsg));
    }

    /**
     * 发送错误响应
     */
    private static sendErrorResponse(ws: WebSocket, errorMessage: string): void {
        const socketMsg: SocketMsg = {
            operate: ServerClientOperate.ERROR,
            timeStamp: this._lastMsgChangeTimestamp,
            data: { error: errorMessage }
        };
        ws.send(JSON.stringify(socketMsg));
    }
}