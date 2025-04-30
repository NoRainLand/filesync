export type ServerConfigType = {
    ps1: string,
    ps2: string,
    ps3: string,
    ps4: string
    httpPort: number,
    socketPort: number,
    serverIp: string
}

/**
 * SQL 命令枚举
 * 定义了数据库操作的各种命令类型
 */
export enum SQLCAMMAND {
    /** 创建数据表 */
    CREATETABLE,
    /** 写入数据到数据库 */
    WRITETODATABASE,
    /** 从数据库删除数据 */
    DELETEFROMDATABASE,
    /** 获取所有消息 */
    GETALLMSGS,
    /** 获取所有文件或文本的哈希值 */
    GETALLFILEORTEXTHASHES,
    /** 通过哈希值获取消息类型 */
    GETMSGTYPEBYHASH,
    /** 获取文件名到哈希名称的映射 */
    GETFILENAME2HASHNAMEMAP,
    /** 获取所有文件哈希值 */
    GETALLFILEHASHES
}

/**
 * 事件名称枚举
 * 定义了系统中的各种事件类型
 */
export enum EventName {
    /** 消息保存成功时触发的事件 */
    ONMESSAGESAVED = "ONMESSAGESAVED",
    /** 删除项目时触发的事件 */
    DELETEITEM = "DELETEITEM",
}