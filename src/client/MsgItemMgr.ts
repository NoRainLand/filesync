import { MsgData } from "../common/CommonDefine";
import { Pool } from "../common/Pool";
import { HtmlControl } from "./HtmlControl";
import { MsgItem } from "./MsgItem";
import { Utils } from "./Utils";

/**文件列表管理类 */
export class MsgItemMgr {
    private static itemPool: Pool<MsgItem>;
    private static fileListDiv: HTMLElement;
    private static msgList: MsgData[];
    private static itemList: MsgItem[];
    private static fileOrTextHashList: string[];
    private static pageParent: HTMLElement;
    static init(pageParent: HTMLElement) {
        this.pageParent = pageParent;
        this.setUI();
        this.itemPool = new Pool<MsgItem>(() => new MsgItem());
        this.itemList = [];
        this.fileOrTextHashList = [];
    }
    private static setUI() {
        this.fileListDiv = Utils.createControl(this.pageParent, HtmlControl.fileList, "fileList", "beforeend");
    }

    static onFullItems(msgList: MsgData[]) {
        this.clearItems();
        this.msgList = msgList;
        msgList.forEach(msg => {
            this.onAddItem(msg);
        });
    }

    static onDeleteItem(fileOrTestHash: string) {
        let index = this.fileOrTextHashList.indexOf(fileOrTestHash);
        if (index != -1) {
            this.fileOrTextHashList.splice(index, 1);
            let item = this.itemList[index];
            this.itemList.splice(index, 1);
            item.clear();
            this.itemPool.recycle(item);
        }
    }

    static onAddItem(msgData: MsgData) {
        if (this.fileOrTextHashList.indexOf(msgData.fileOrTextHash) == -1) {
            this.fileOrTextHashList.push(msgData.fileOrTextHash);
            let hash = this.fileOrTextHashList[0];//移除最前面的一条
            this.onDeleteItem(hash);
            let item = this.itemPool.get();
            item.setData(msgData);
            item.setMyParnet(this.fileListDiv);
        }
    }


    /**清理全部item */
    private static clearItems() {
        if (this.msgList) {
            this.msgList.length = 0;
        }

        if (this.itemList) {
            this.itemList.forEach(item => {
                item.clear();
            });
            this.itemList.length = 0;
        }

        if (this.fileOrTextHashList) {
            this.fileOrTextHashList.length = 0;
        }
    }

    static clear() {
        this.clearItems();
    }

}