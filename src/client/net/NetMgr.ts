import { ServerClientOperate, ServerInfo, SocketMsg } from "../../common/CommonDefine";
import { NetHttp } from "./NetHttp";
import { NetSocket } from "./NetSocket";

export class NetMgr {
    private static netHttp: NetHttp;
    private static netSocket: NetSocket;

    constructor() {

    }

    static init() {
        this.netHttp = new NetHttp();
        this.netSocket = new NetSocket();
    }


    /**初始化服务器信息 */
    static initSocketInfo(): Promise<ServerInfo> {
        return this.netHttp.getSocketInfo<ServerInfo>()
    }

    /**上传文件 */
    static uploadMsg(formData: FormData, onprogress: (event: ProgressEvent) => {}) {
        return this.netHttp.uploadMsg(formData, onprogress);
    }

    /**初始化socket */
    static initSocket() {
        this.netSocket.initSocket();
    }


    /**获取全量信息 */
    static getFullMsg() {
        let msg: SocketMsg = { operate: ServerClientOperate.FULL, timeStamp: Date.now() };
        return this.netSocket?.send(JSON.stringify(msg));
    }

    /**删除信息 */
    static deleteMsg(hash: string) {
        let msg: SocketMsg = { operate: ServerClientOperate.DELETE, timeStamp: Date.now(), data: { fileOrTextHash: hash } };
        return this.netSocket?.send(JSON.stringify(msg));
    }
}