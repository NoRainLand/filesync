export type msgType = {
    msgType: 'file' | 'text',
    fileOrTextHash: string,
    timestamp: number,
    fileName?: string,
    text?: string,
    url?: string,
    action?: "add" | "delete" | "update"
}
export type actionType = {
    action: "delete" | "update",
    fileOrTextHash?: string,
}
export type eventType = "deleteItem" | "downloadFile";

export type colorType = "red" | "blue" | "gray" | "green";
