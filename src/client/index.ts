import "../../client/css/style.scss"; //引入样式 这个是copy到client文件之后的路径
import { ProjectConfig } from "../ProjectConfig";
import { EventMgr } from "../common/EventMgr";
import { NiarApp } from "../common/NiarApp";
import { Color, EventName } from "./ClientDefine";
import { InputMgr } from "./InputMgr";
import { Logger } from "./Logger";
import { MsgItemMgr } from "./MsgItemMgr";
import { QRCodeButton } from "./QRCodeButton";
import { ThemeMgr } from "./ThemeMgr";
import { Utils } from "./Utils";
export class index {

    statusText: HTMLParagraphElement;

    pageParent: HTMLElement;
    constructor() {
        this.init();
    }
    init() {
        (<any>window)["NiarApp"] = NiarApp;
        Logger.tranLogger();
        ProjectConfig.openVC && Utils.openVConsole();
        this.initUI();
        ThemeMgr.init(this.pageParent);
        MsgItemMgr.init(this.pageParent);
        QRCodeButton.init(this.pageParent);
        InputMgr.init();
        this.addEvent();
        // HttpMgr.getSocketInfo<ServerInfo>()
        //     .then((socketInfo) => {
        //         Config.serverURL = socketInfo.socketServerURL;
        //         Config.socketPort = socketInfo.socketPort;
        //         Config.version = socketInfo.version;
        //         // SocketMgr.initSocket();
        //         Logger.log("当前版本" + Config.version);
        //     })
        //     .catch((error) => {
        //         console.warn(error);
        //         this.showMsg("获取socket信息失败", Color.red);
        //     });
    }
    initUI() {
        this.pageParent = document.getElementById('container') as HTMLElement;
        this.statusText = document.getElementById('statusText') as HTMLParagraphElement;
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

    /**显示固定的页面消息 */
    showMsg(msg: string, color: Color) {
        if (this.statusText) {
            this.statusText.textContent = msg;
            this.statusText.style.color = color;
        }
    }

    clear() {
        MsgItemMgr.clear();
        InputMgr.clear();
        ThemeMgr.clear();
    }

}
new index();