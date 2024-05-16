/**服务器信息 */
export type ServerInfo = {
    "socketServerURL": string,
    "socketPort": number,
    "version": string
}

export type MsgData = {
    msgType: 'file' | 'text',
    fileOrTextHash: string,
    timestamp: number,
    size: number,
    fileName?: string,
    hashName?: string,
    text?: string,
    url?: string,
}

/**socket服务器客户端交互 */
export enum ServerClientOperate {
    /**添加消息 */
    ADD = "ADD",
    /**删除消息 */
    DELETE = "DELETE",
    /**全量消息 */
    FULL = "FULL",
    /**心跳 */
    HEARTBEAT = "HEARTBEAT",
    /**刷新 */
    REFRESH = "REFRESH",
    /**错误 */
    ERROR = "ERROR",
}

export type SocketMsg = {
    operate: ServerClientOperate,
    timeStamp: number,
    data?: any | DeleteData | AddData | FullData | ErrorData
}

export type DeleteData = {
    fileOrTextHash: string
}
export type AddData = {
    msg: MsgData
}

export type FullData = {
    msgs: MsgData[]
}

export type ErrorData = {
    error: string
}

