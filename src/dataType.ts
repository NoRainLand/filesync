export type msgType = {
    msgType: 'file' | 'text',
    fileOrTextHash: string,
    timestamp: number,
    fileName?: string,
    text?: string,
    url?: string,
    action?: "add" | "delete" | "update"
    size?: number,
}
export type actionType = {
    action: "delete" | "update",
    fileOrTextHash?: string,
}
export type eventType = "deleteItem" | "msgSaved";

export type socketInfoType = { "socketURL": string, "socketPORT": number, "version": string };