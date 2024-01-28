export type msgType = {
    msgType: 'file' | 'text',
    fileOrTextHash: string,
    timestamp: number,
    fileName?: string,
    text?: string,
    url?: string,
    action?: "add" | "delete" | "update"
    size: number,
}

export type updateMsgType = { action: string, msgs: msgType[] };

export type heartBeatType = { action: "heartBeat", salt: string };

export type actionType = {
    action: "delete" | "update",
    fileOrTextHash?: string,
}

export type socketInfoType = { "socketURL": string, "socketPORT": number, "version": string };


//---------------本地-------------

export type socketMsgType = { event: "onmessage" | "onopen" | "onclose" | "onerror", data: any }

export type eventType = "deleteItem" | "downloadFile" | "socketEvent";

export type colorType = "red" | "blue" | "gray" | "green";

export type dialogType = "msg" | "qrcode";
