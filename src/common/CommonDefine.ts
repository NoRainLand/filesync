/**服务器信息 */
export type ServerInfo = {
    "socketServerURL": string,
    "socketPort": number,
    "projectName": string,
    "version": string,
    "author": string,
    "description": string,
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
    /**添加消息 服务器主动下发*/
    ADD = "ADD",
    /**删除消息 服务器主动下发*/
    DELETE = "DELETE",
    /**全量消息 客户端主动请求全部消息*/
    FULL = "FULL",
    /**心跳 客户端主动请求，服务器原样返回*/
    HEARTBEAT = "HEARTBEAT",
    /**刷新 客户端主动请求，服务器返回最后操作时间戳*/
    REFRESH = "REFRESH",
    /**错误 服务器主动下发 */
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

