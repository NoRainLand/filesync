import { CommonConfig } from "../../common/CommonConfig";
import { HtmlControl } from "../config/HtmlControl";
import { Utils } from "../utils/Utils";
import { TipsMgr } from "./TipsMgr";

export class RunButton {
    private static pageParent: HTMLElement | null;
    private static runButton: HTMLElement
    static init(pageParent: HTMLElement) {
        this.pageParent = pageParent;
        if (Utils.isWin()) {
            this.setUI();
            this.addEvent();
        }
    }
    private static setUI() {
        this.runButton = Utils.createConnonControl(this.pageParent!, HtmlControl.runButton, "runButton");
    }
    private static addEvent() {
        this.runButton.addEventListener('click', this.onShowExeDownload);
    }
    private static removeEvent() {
        this.runButton.removeEventListener('click', this.onShowExeDownload);
    }
    private static onShowExeDownload = () => {
        TipsMgr.showDialog("是否下载桌面快捷发送工具？", this, () => {
            Utils.downloadFile(CommonConfig.toolUrl, CommonConfig.toolName);
        }, null, "下载提示");
    }
    static clear() {
        this.pageParent?.removeChild(this.runButton);
        this.pageParent = null;
        this.removeEvent();
    }
}