export type socketActionType = "add" | "delete" | "full" | "heartBeat" | "refresh" | "error";

export type socketMsgType = {
    action: socketActionType,
    timeStamp?: number,
    data?: any,
}

export type msgType = {
    msgType: 'file' | 'text',
    fileOrTextHash: string,
    timestamp: number,
    size: number,
    fileName?: string,
    hashName?: string,
    text?: string,
    url?: string,
}

export type actionFullMsgType = { msgs: msgType[] };

export type actionDelteType = { fileOrTextHash: string }

export type actionAddType = { msg: msgType }


export type socketInfoType = { "socketURL": string, "socketPORT": number, "version": string };


/**事件类型 */
export type eventType = "deleteItem" | "msgSaved";

/**服务器配置 */
export type configType = { "ps1": string, "ps2": string, "http_port": number, "socket_port": number }