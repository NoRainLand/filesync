import { ServerInfo } from "../common/CommonDefine";
import { EventMgr } from "../common/EventMgr";
import { Pool } from "../common/Pool";
import { ProjectConfig } from "../ProjectConfig";
import { EventName } from "./ClientDefine";
import { Config } from "./Config";
import { actionAddType, actionDelteType, actionFullMsgType, colorType, msgType, SocketMsgType } from "./DataType";
import { HttpMgr } from "./HttpMgr";
import { ListItem } from "./ListItem";
import { Logger } from "./Logger";
import { SocketMgr } from "./SocketMgr";
import { TipsMgr } from "./TipsMgr";

export class index {
    fileInput: any;
    textInput: any;
    statusText: any;
    uploadButton: HTMLButtonElement;
    fileList: HTMLElement;
    msgList: msgType[];
    itemPool: Pool<ListItem>;
    msgHashArr: Array<string>;

    itemList: ListItem[];

    private aHref: HTMLAnchorElement;

    private _inputLock = false;
    get inputLock(): boolean {
        return this._inputLock;
    }
    set inputLock(value: boolean) {
        this._inputLock = value;
        this.uploadButton.value = value ? "发送中" : "发送";
        this.uploadButton.setAttribute('aria-busy', value.toString());
        this.textInput.placeholder = value ? "发送中…" : "等待输入…";
    }
    sendTimeout: number = 500;
    themeButtonSvg: HTMLElement;
    qrcodeButtonSvg: HTMLElement;

    vConsole: any;

    clipboard: any;

    private _isDark: number = -1;
    get isDark(): boolean {
        if (this._isDark == -1) {
            let dark = localStorage.getItem("isDark");
            if (dark == null || dark == void 0) {
                this._isDark = 0;
                localStorage.setItem("isDark", "false");
            } else {
                this._isDark = ((dark == "true") ? 1 : 0);
            }
        }
        return !!this._isDark;
    }
    set isDark(value: boolean) {
        this._isDark = value ? 1 : 0;
        localStorage.setItem("isDark", value.toString());
    }

    constructor() {
        this.init();
        (<any>window).NiarApp = this;
    }

    init() {
        this.getUI();
        this.inputLock = false;
        this.msgList = [];
        this.msgHashArr = [];
        this.itemList = [];
        this.itemPool = new Pool(() => new ListItem());
        this.initTheme();

        this.getSocketInfo();
        this.addEvent();
        Logger.tranLogger();
        if (ProjectConfig.openVC) {
            this.vConsole = new (window as any).VConsole();
        }

        this.clipboard = new (window as any).ClipboardJS("." + Config.copyBtnClass);
        this.clipboard.on('error', function (e: any) {
            TipsMgr.showTips("复制失败，可能是权限不足或者浏览器不支持");
            console.error(e);
        });
    }

    getUI() {
        this.fileInput = document.getElementById('fileInput');
        this.textInput = document.getElementById('textInput');
        this.statusText = document.getElementById('statusText');
        this.uploadButton = document.getElementById('uploadButton') as HTMLButtonElement;

        this.fileList = document.getElementById('fileList') as HTMLUListElement;
        this.themeButtonSvg = document.getElementById('themeButton') as HTMLElement;
        this.qrcodeButtonSvg = document.getElementById('qrcodeButton') as HTMLElement;

    }


    initTheme() {
        if (this.isDark) {
            this.themeButtonSvg.innerHTML = Config.sunSVG;
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            this.themeButtonSvg.innerHTML = Config.moonSVG;
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    addEvent() {
        EventMgr.on(EventName.deleteItem, this.deleteItem, this);
        EventMgr.on(EventName.downloadFile, this.downloadFile, this);
        this.uploadButton.addEventListener('click', this.sendMsg.bind(this));
        this.textInput.addEventListener('keydown', this.onKeyDown.bind(this));

        this.themeButtonSvg.addEventListener('click', this.onChangeTheme.bind(this));

        this.qrcodeButtonSvg.addEventListener('click', this.onShowLocalQrcode.bind(this));

        EventMgr.on('socketEvent', this.onSocketEvent, this);

        document.addEventListener(EventName.visibilitychange, () => {
            EventMgr.emit(EventName.visibilitychange, document.hidden);
        });
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!this.inputLock) {
                this.sendMsg();
            }
        }
    }

    onChangeTheme() {
        this.isDark = !this.isDark;
        this.initTheme();
    }

    onShowLocalQrcode() {
        TipsMgr.showAlert(window.location.href, "当前网址", "qrcode");
    }


    sendMsg() {
        let timeoutId: any = null;
        let text = this.textInput.value;
        if (!this.fileInput!.files.length && !text) {
            TipsMgr.showTips('请选择文件或输入文本');
            return;
        }
        this.inputLock = true;
        const file = this.fileInput!.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('text', text);
        this.fileInput.disabled = true;
        this.textInput.disabled = true;
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        this.sendHttpMsg(formData);
    }


    onSocketEvent(msg: { event: "onmessage" | "onopen" | "onclose" | "onerror", data: any }) {
        switch (msg.event) {
            case "onmessage":
                this.onSocketMessage(msg.data);
                break;
            case "onopen":
                this.onSocketOpen();
                break;
            case "onclose":
                this.onSocketClose(msg.data);
                break;
            case "onerror":
                this.onSocketError(msg.data);
                break;
        }
    }

    //-------------服务器下发-----------------

    createItem(data: actionAddType | null, msg?: msgType) {
        let itemData = data?.msg || msg;
        if (this.msgList.length > 100) {
            this.msgList.shift();
        }
        if (this.msgHashArr.indexOf(itemData!.fileOrTextHash) == -1) {
            let item = this.itemPool.get();
            item.setData(itemData!);
            item.setMyParnet(this.fileList);
            this.msgHashArr.push(itemData!.fileOrTextHash);
            this.msgList.unshift(itemData!);
            this.itemList.unshift(item);
        }
    }


    removeItem(data: actionDelteType) {
        for (let i = 0; i < this.msgList.length; i++) {
            if (this.msgList[i].fileOrTextHash == data.fileOrTextHash) {
                this.itemList[i].onRemoveItem();
                this.msgList.splice(i, 1);
                this.itemList.splice(i, 1);
                this.msgHashArr.splice(i, 1);
                break;
            }
        }
    }

    fullItem(data: actionFullMsgType) {
        this.clearAllItem();
        data.msgs.forEach((msg) => {
            this.createItem(null, msg);
        });
    }

    private clearAllItem() {
        this.msgList.length = 0;
        this.msgHashArr.length = 0;
        this.itemList.forEach((item) => {
            item.onRemoveItem();
        });
        this.itemList.length = 0;
    }

    //--------------客户端操作----------------

    deleteItem(fileOrTextHash: string) {
        let data: SocketMsgType = { action: 'delete', data: fileOrTextHash };
        this.sendSocketMsg(JSON.stringify(data));
    }

    downloadFile(url: string, fileName: string) {
        if (!this.aHref) {
            this.aHref = document.createElement('a');
        }
        this.aHref.href = url;
        this.aHref.download = fileName;
        this.aHref.target = '_blank'; // 在当前页面中打开链接
        document.body.appendChild(this.aHref);
        this.aHref.click();
        document.body.removeChild(this.aHref);
    }

    //-------------提示-----------------

    showMsg(msg: string, color: colorType) {
        if (this.statusText) {
            this.statusText.textContent = msg;
            this.statusText.style.color = color;
        }
    }

    //-------------http-----------------

    getSocketInfo() {
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
                this.showMsg("获取socket信息失败", "red");
            });
    }

    sendHttpMsg(formData: FormData) {
        HttpMgr.uploadMsg(formData, (event: ProgressEvent) => {
            if (event.lengthComputable) {
                if (event.total > Config.showProgressMinSize) {
                    TipsMgr.showProgress(event.loaded / event.total);
                }
            }
            return {};
        })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.warn(error);
                if (error.response) {
                    TipsMgr.showAlert(error.response.data, "发送失败");
                } else {
                    TipsMgr.showAlert(error.message, "发送失败");
                }
            })
            .finally(() => {
                setTimeout(() => {
                    this.inputLock = false;
                    TipsMgr.hideProgress();
                }, this.sendTimeout);
                this.fileInput.value = '';
                this.textInput.value = '';
                this.fileInput.disabled = false;
                this.textInput.disabled = false;
            });
    }


    //-------------socket-----------------

    onSocketMessage(data: SocketMsgType) {
        switch (data.action) {
            case "add":
                this.createItem(data.data);
                break;
            case "delete":
                this.removeItem(data.data);
                break;
            case "full":
                this.fullItem(data.data);//updateMsgType
                break;
            default:
                console.warn("消息类型错误", data);
                break;
        }
    }

    onSocketOpen() {
        this.showMsg("连接成功", "green");
        this.inputLock = false;
        // 向服务器发送一个请求所有数据的消息
        let data: SocketMsgType = { action: "full" }
        this.sendSocketMsg(JSON.stringify(data));
    }

    onSocketClose(isReconnect: boolean) {
        this.inputLock = true;
        if (!isReconnect) {
            this.showMsg("服务器已关闭", "red");
            TipsMgr.showDialog("服务器已关闭，点击确定刷新页面", this, () => {
                location.reload();
            }, null, "提示", true);
        } else {
            this.showMsg("正在重连...", "blue");
        }
    }

    onSocketError(event: Event) {
        TipsMgr.showAlert(JSON.stringify(event), "socket错误");
    }

    sendSocketMsg(msg: string) {
        let readyState = SocketMgr.send(msg);
        if (readyState != WebSocket.OPEN) {
            TipsMgr.showAlert("消息发送失败，socket状态异常，状态码:" + readyState, "socket错误");
            switch (readyState) {
                case -1:
                    console.warn("socket未初始化");//怎么会出现这个情况？
                    break;
                case WebSocket.CONNECTING:
                    console.warn("socket正在连接");
                    break;
                case WebSocket.CLOSING:
                    console.warn("socket正在关闭");
                    break;
                case WebSocket.CLOSED:
                    console.warn("socket已关闭");
                    break;
            }
        }
    }
}

new index();