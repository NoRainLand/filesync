import { ProjectConfig } from "../../ProjectConfig";
import { MsgData } from "../../common/CommonDefine";
import { Pool } from "../../common/Pool";
import { HtmlControl } from "../config/HtmlControl";
import { Utils } from "../utils/Utils";
import { MsgItem } from "./MsgItem";
import { TipsMgr } from "./TipsMgr";

/**文件列表管理类 */
export class MsgItemList {
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
        Utils.copyTextByClipboard(HtmlControl.copyNodeButton, this.copySuccess.bind(this));
    }
    private static setUI() {
        this.fileListDiv = Utils.createConnonControl(this.pageParent, HtmlControl.fileList, "fileList");
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
            if (item) {
                item.clear();
                this.itemPool.recycle(item);
            }
        }
    }

    private static copySuccess() {
        TipsMgr.showNotice("复制成功");
    }

    static onAddItem(msgData: MsgData) {
        if (this.fileOrTextHashList.indexOf(msgData.fileOrTextHash) == -1) {
            this.fileOrTextHashList.push(msgData.fileOrTextHash);
            this.removeItems()
            let item = this.itemPool.get();
            item.setData(msgData, this.fileListDiv);
            this.itemList.push(item);
        }
    }

    private static removeItems() {
        if (this.fileOrTextHashList.length > ProjectConfig.maxMsgLen) {
            for (let i = 0; i < ProjectConfig.removeMsgLen; i++) {
                let hash = this.fileOrTextHashList[0];
                if (hash) {
                    this.onDeleteItem(hash);
                }
            }
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