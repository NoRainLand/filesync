import { ProjectConfig } from "../ProjectConfig";
import { ServerClientOperate, ServerInfo, SocketMsg } from "../common/CommonDefine";
import { EventMgr } from "../common/EventMgr";
import { NiarApp } from "../common/NiarApp";
import { BtnEvent, Color, EventName, InputStatus, SocketEvent } from "./config/ClientDefine";
import { Config } from "./config/Config";
import { HtmlControl } from "./config/HtmlControl";
import { NetMgr } from "./net/NetMgr";
import { Logger } from "./utils/Logger";
import { Utils } from "./utils/Utils";
import { InputMgr } from "./view/InputMgr";
import { MsgItemList } from "./view/MsgItemList";
import { QRCodeButton } from "./view/QRCodeButton";
import { RunButton } from "./view/RunButton";
import { ThemeMgr } from "./view/ThemeMgr";
import { TipsMgr } from "./view/TipsMgr";
export class index {

    pageParent: HTMLElement;
    constructor() {
        this.init();
    }
    init() {
        (<any>window)["NiarApp"] = NiarApp;
        Utils.fixMinWidth();
        NiarApp.init(this);
        document.title = ProjectConfig.projectName;
        Logger.tranLogger();
        this.initUI();
        QRCodeButton.init(this.pageParent);
        ThemeMgr.init(this.pageParent);
        RunButton.init(this.pageParent);
        MsgItemList.init(this.pageParent);
        InputMgr.init(this.pageParent);
        NetMgr.init();
        this.addEvent();

        NetMgr.initSocketInfo()
            .then((socketInfo: ServerInfo) => {
                Config.serverURL = socketInfo.socketServerURL;
                Config.socketPort = socketInfo.socketPort;
                Config.version = socketInfo.version;
                Config.author = socketInfo.author;
                Config.description = socketInfo.description;
                Config.projectName = socketInfo.projectName;
                NetMgr.initSocket();
                this.printMsg();
            }).catch((e) => {
                Logger.error(e);
            });
    }
    initUI() {
        this.pageParent = Utils.createConnonControl(document.body, HtmlControl.container, "container") as HTMLElement;
    }


    printMsg() {
        Logger.log("%c" + Config.projectName + "：" + "%c" + Config.description, `color: ${Color.red};font-size: large;`, `color: ${Color.blue}; `);
        Logger.log("%c作者：" + "%c" + Config.author, `color: ${Color.green}; `, `color: ${Color.blue};`);
        Logger.log("%c当前版本：" + "%c" + Config.version, `color: ${Color.green}; `, `color: ${Color.blue}; `);
    }

    addEvent() {
        document.addEventListener(EventName.visibilitychange, () => {
            EventMgr.emit(EventName.visibilitychange, document.hidden);
        });

        EventMgr.on(SocketEvent.onclose, this.onSocketClose, this);
        EventMgr.on(SocketEvent.onopen, this.onSocketOpen, this);
        EventMgr.on(SocketEvent.onmessage, this.onSocketMsg, this);
        EventMgr.on(SocketEvent.onerror, this.onSocketError, this);
        EventMgr.on(SocketEvent.onopening, this.onSocketOpening, this);


        EventMgr.on(BtnEvent.deleteItem, this.onDeleteItem, this);
        EventMgr.on(BtnEvent.downloadFile, this.onDownloadFile, this);
    }

    removeEvent() {
        document.removeEventListener(EventName.visibilitychange, () => {
            EventMgr.emit(EventName.visibilitychange, document.hidden);
        });


        EventMgr.off(SocketEvent.onclose, this.onSocketClose, this);
        EventMgr.off(SocketEvent.onopen, this.onSocketOpen, this);
        EventMgr.off(SocketEvent.onmessage, this.onSocketMsg, this);
        EventMgr.off(SocketEvent.onerror, this.onSocketError, this);
        EventMgr.off(SocketEvent.onopening, this.onSocketOpening, this);

        EventMgr.off(BtnEvent.deleteItem, this.onDeleteItem, this);
        EventMgr.off(BtnEvent.downloadFile, this.onDownloadFile, this);
    }


    private onSocketClose(isClient: boolean = false) {
        InputMgr.changeStatus(InputStatus.error);
        if (isClient) {
            TipsMgr.showDialog("服务器已关闭，点击确定刷新页面尝试重连", this, () => {
                location.reload();
            }, null, "提示", true);
        }
    }

    private onSocketOpen() {
        InputMgr.changeStatus(InputStatus.waiting);
        NetMgr.getFullMsg();
    }

    private onSocketError() {
        InputMgr.changeStatus(InputStatus.error);
    }
    private onSocketMsg(msg: SocketMsg) {
        switch (msg.operate) {
            case ServerClientOperate.ADD:
                MsgItemList.onAddItem(msg.data.msg);
                break;
            case ServerClientOperate.DELETE:
                MsgItemList.onDeleteItem(msg.data.fileOrTextHash);
                break;
            case ServerClientOperate.FULL:
                MsgItemList.onFullItems(msg.data.msgs);
                break;
        }
    }


    private onSocketOpening() {
        InputMgr.changeStatus(InputStatus.loading);
    }



    private onDeleteItem(hash: string) {
        NetMgr.deleteMsg(hash);
    }

    private onDownloadFile(url: string, fileName: string) {
        Utils.downloadFile(url, fileName);
    }


    clear() {
        MsgItemList.clear();
        InputMgr.clear();
        ThemeMgr.clear();
    }

}
new index();