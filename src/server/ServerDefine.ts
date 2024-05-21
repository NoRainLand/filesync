
export type ServerConfigType = {
    ps1: string,
    ps2: string,
    ps3: string,
    httpPort: number,
    socketPort: number
}


export enum SQLCAMMAND {
    CREATETABLE,
    WRITETODATABASE,
    DELETEFROMDATABASE,
    GETALLMSGS,
    GETALLFILEORTEXTHASHES,
    GETMSGTYPEBYHASH,
    GETFILENAME2HASHNAMEMAP
}

export enum EventName {
    ONMESSAGESAVED = "ONMESSAGESAVED",
    DELETEITEM = "DELETEITEM",
}
