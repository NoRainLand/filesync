import { msgType } from "./dataType";
import { dbHandler } from "./dbHandler";

export class dataCtrl {
    static writeToDatabase(msg: msgType): Promise<void> {
        return dbHandler.writeToDatabase(msg)
    }
    static deleteMsg(hash: string): Promise<void> {
        return dbHandler.deleteFromDatabase(hash);
    }
    static getAllMsgs(): Promise<msgType[]> {
        return dbHandler.getAllMsgs();
    }
    static getAllFileOrTextHashes(): Promise<string[]> {
        return dbHandler.getAllFileOrTextHashes();
    }
    static getMsgTypeByHash(hash: string): Promise<msgType> {
        return dbHandler.getMsgTypeByHash(hash);
    }
}