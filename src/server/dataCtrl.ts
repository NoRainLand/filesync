import { msgType } from "./DataType";
import { DbHandler } from "./DbHandler";

export class DataCtrl {
    static writeToDatabase(msg: msgType): Promise<void> {
        return DbHandler.writeToDatabase(msg)
    }
    static deleteMsg(hash: string): Promise<void> {
        return DbHandler.deleteFromDatabase(hash);
    }
    static getAllMsgs(): Promise<msgType[]> {
        return DbHandler.getAllMsgs();
    }
    static getAllFileOrTextHashes(): Promise<string[]> {
        return DbHandler.getAllFileOrTextHashes();
    }
    static getMsgTypeByHash(hash: string): Promise<msgType> {
        return DbHandler.getMsgTypeByHash(hash);
    }


    static getFileName2HashNameMap(): Promise<Map<string, string>> {
        return DbHandler.getFileName2HashNameMap();
    }
}