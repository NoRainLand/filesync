import { dataHandler } from "./dataHandler";
import { msgType } from "./dataType";
import { eventSystem } from "./eventSystem";

export class dataCtrl {
    static saveMsg(msg: msgType) {
        dataHandler.saveMsg(msg).then(() => {
            eventSystem.emit('msgSaved', msg);
        });
    }
    static async deleteMsg(hash: string) {
        await dataHandler.deleteFromDatabase(hash);
    }
    static async getAllMsgs(): Promise<msgType[]> {
        return await dataHandler.getAllMsgs();
    }
    static async getAllFileOrTextHashes(): Promise<string[]> {
        return await dataHandler.getAllFileOrTextHashes();
    }
    static async getMsgTypeByHash(hash: string): Promise<msgType> {
        return await dataHandler.getMsgTypeByHash(hash);
    }
}