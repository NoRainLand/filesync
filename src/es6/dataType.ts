export type socketActionType = "add" | "delete" | "full" | "heartBeat" | "refresh";

export type socketMsgType = {
    action: socketActionType,
    timeStamp?: number,
    data?: any,
}

export type msgType = {
    msgType: 'file' | 'text',
    fileOrTextHash: string,
    timestamp: number,
    fileName?: string,
    text?: string,
    url?: string,
    size: number,
}

export type actionFullMsgType = { msgs: msgType[] };

export type actionDelteType = { fileOrTextHash: string }

export type actionAddType = { msg: msgType }

export type socketInfoType = { "socketURL": string, "socketPORT": number, "version": string };


//---------------本地-------------

export type socketEventType = { event: "onmessage" | "onopen" | "onclose" | "onerror", data: any }

export type eventType = "deleteItem" | "downloadFile" | "socketEvent" | "visibilitychange";

export type colorType = "red" | "blue" | "gray" | "green";

export type dialogType = "msg" | "qrcode";
