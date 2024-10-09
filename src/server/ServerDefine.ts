
export type ServerConfigType = {
    ps1: string,
    ps2: string,
    ps3: string,
    ps4: string
    httpPort: number,
    socketPort: number,
    serverIp: string
}


export enum SQLCAMMAND {
    CREATETABLE,
    WRITETODATABASE,
    DELETEFROMDATABASE,
    GETALLMSGS,
    GETALLFILEORTEXTHASHES,
    GETMSGTYPEBYHASH,
    GETFILENAME2HASHNAMEMAP,
    GETALLFILEHASHES
}

export enum EventName {
    ONMESSAGESAVED = "ONMESSAGESAVED",
    DELETEITEM = "DELETEITEM",
}
