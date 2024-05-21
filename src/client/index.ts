import "../../client/css/style.scss"; //引入样式 这个是copy到client文件之后的路径
import { ProjectConfig } from "../ProjectConfig";
import { ServerClientOperate, ServerInfo, SocketMsg } from "../common/CommonDefine";
import { EventMgr } from "../common/EventMgr";
import { NiarApp } from "../common/NiarApp";
import { BtnEvent, EventName, InputStatus, SocketEvent } from "./config/ClientDefine";
import { Config } from "./config/Config";
import { HtmlControl } from "./config/HtmlControl";
import { NetMgr } from "./net/NetMgr";
import { Logger } from "./utils/Logger";
import { Utils } from "./utils/Utils";
import { InputMgr } from "./view/InputMgr";
import { MsgItemList } from "./view/MsgItemList";
import { QRCodeButton } from "./view/QRCodeButton";
import { ThemeMgr } from "./view/ThemeMgr";
export class index {

    pageParent: HTMLElement;
    constructor() {
        this.init();
    }
    init() {
        (<any>window)["NiarApp"] = NiarApp;
        document.title = ProjectConfig.projectName;
        Logger.tranLogger();
        ProjectConfig.openVC && Utils.openVConsole();
        this.initUI();
        InputMgr.init(this.pageParent);
        MsgItemList.init(this.pageParent);
        ThemeMgr.init(this.pageParent);
        QRCodeButton.init(this.pageParent);
        NetMgr.init();
        this.addEvent();

        NetMgr.initSocketInfo()
            .then((socketInfo: ServerInfo) => {
                Config.serverURL = socketInfo.socketServerURL;
                Config.socketPort = socketInfo.socketPort;
                Config.version = socketInfo.version;
                NetMgr.initSocket();
                Logger.log("当前版本" + Config.version);
            }).catch((e) => {
                Logger.error(e);
            });
    }
    initUI() {
        this.pageParent = Utils.createConnonControl(document.body, HtmlControl.container, "container") as HTMLElement;
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
    }

    private onSocketOpen() {
        InputMgr.changeStatus(InputStatus.waiting);
        NetMgr.getFullMsg();
    }

    private onSocketMsg(msg: SocketMsg) {
        console.log(msg);
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

    private onSocketError() {
        InputMgr.changeStatus(InputStatus.error);
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