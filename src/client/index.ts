import "../../client/css/style.scss"; //引入样式 这个是copy到client文件之后的路径
import { ProjectConfig } from "../ProjectConfig";
import { ServerInfo } from "../common/CommonDefine";
import { EventMgr } from "../common/EventMgr";
import { NiarApp } from "../common/NiarApp";
import { EventName } from "./ClientDefine";
import { Config } from "./Config";
import { HtmlControl } from "./HtmlControl";
import { HttpMgr } from "./HttpMgr";
import { InputMgr } from "./InputMgr";
import { Logger } from "./Logger";
import { MsgItemMgr } from "./MsgItemMgr";
import { QRCodeButton } from "./QRCodeButton";
import { SocketMgr } from "./SocketMgr";
import { ThemeMgr } from "./ThemeMgr";
import { Utils } from "./Utils";
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
        ThemeMgr.init(this.pageParent);
        MsgItemMgr.init(this.pageParent);
        QRCodeButton.init(this.pageParent);
        InputMgr.init(this.pageParent);
        this.addEvent();
        HttpMgr.getSocketInfo<ServerInfo>()
            .then((socketInfo) => {
                Config.serverURL = socketInfo.socketServerURL;
                Config.socketPort = socketInfo.socketPort;
                Config.version = socketInfo.version;
                SocketMgr.initSocket();
                Logger.log("当前版本" + Config.version);
            })
            .catch((error) => {
                console.warn(error);
            });
    }
    initUI() {
        this.pageParent = Utils.createControl(document.body, HtmlControl.container, "container") as HTMLElement;
    }


    addEvent() {
        document.addEventListener(EventName.visibilitychange, () => {
            EventMgr.emit(EventName.visibilitychange, document.hidden);
        });
    }

    removeEvent() {
        document.removeEventListener(EventName.visibilitychange, () => {
            EventMgr.emit(EventName.visibilitychange, document.hidden);
        });
    }

    clear() {
        MsgItemMgr.clear();
        InputMgr.clear();
        ThemeMgr.clear();
    }

}
new index();