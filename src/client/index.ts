import { config } from "./config";
import { actionAddType, actionDelteType, actionFullMsgType, colorType, msgType, socketInfoType, socketMsgType } from "./dataType";
import { eventSystem } from "./eventSystem";
import { httpMgr } from "./httpMgr";
import { item } from "./item";
import { logger } from "./logger";
import { objectPool } from "./objectPool";
import { socketMgr } from "./socketMgr";
import { tipsMgr } from "./tipsMgr";

export class index {
    fileInput: any;
    textInput: any;
    statusText: any;
    uploadButton: HTMLButtonElement;
    fileList: HTMLElement;
    msgList: msgType[];
    itemPool: objectPool<item>;
    msgHashArr: Array<string>;

    itemList: item[];

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
        this.itemPool = new objectPool(() => new item());
        this.initTheme();

        this.getSocketInfo();
        this.addEvent();
        logger.tranLogger();
        if (config.openVconsole) {
            this.vConsole = new (window as any).VConsole();
        }
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
            this.themeButtonSvg.innerHTML = config.sunSVG;
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            this.themeButtonSvg.innerHTML = config.moonSVG;
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    addEvent() {
        eventSystem.on('deleteItem', this.deleteItem.bind(this));
        eventSystem.on('downloadFile', this.downloadFile.bind(this));
        this.uploadButton!.addEventListener('click', this.sendMsg.bind(this));
        this.textInput.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (!this.inputLock) {
                    this.sendMsg();
                }
            }
        });

        this.themeButtonSvg.addEventListener('click', () => {
            this.isDark = !this.isDark;
            this.initTheme();
        });

        this.qrcodeButtonSvg.addEventListener('click', () => {
            tipsMgr.showAlert(window.location.href, "当前网址", "qrcode");
        });

        eventSystem.on('socketEvent', this.onSocketEvent.bind(this));

        document.addEventListener('visibilitychange', () => {
            eventSystem.emit("visibilitychange", document.hidden);
        });
    }


    sendMsg() {
        let timeoutId: any = null;
        let text = this.textInput.value;
        if (!this.fileInput!.files.length && !text) {
            tipsMgr.showTips('请选择文件或输入文本');
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
        let data: socketMsgType = { action: 'delete', data: fileOrTextHash };
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
        httpMgr.getSocketInfo<socketInfoType>()
            .then((socketInfo) => {
                config.URL = socketInfo.socketURL;
                config.SocketIOPORT = socketInfo.socketPORT;
                config.version = socketInfo.version;
                socketMgr.initSocket();
                logger.log("当前版本" + config.version);
            })
            .catch((error) => {
                console.warn(error);
                this.showMsg("获取socket信息失败", "red");
            });
    }

    sendHttpMsg(formData: FormData) {
        httpMgr.sendMsg(formData, (event: ProgressEvent) => {
            if (event.lengthComputable) {
                if (event.total > config.showProgressMinSize) {
                    tipsMgr.showProgress(event.loaded / event.total);
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
                    tipsMgr.showAlert(error.response.data, "发送失败");
                } else {
                    tipsMgr.showAlert(error.message, "发送失败");
                }
            })
            .finally(() => {
                setTimeout(() => {
                    this.inputLock = false;
                    tipsMgr.hideProgress();
                }, this.sendTimeout);
                this.fileInput.value = '';
                this.textInput.value = '';
                this.fileInput.disabled = false;
                this.textInput.disabled = false;
            });
    }


    //-------------socket-----------------

    onSocketMessage(data: socketMsgType) {
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
        let data: socketMsgType = { action: "full" }
        this.sendSocketMsg(JSON.stringify(data));
    }

    onSocketClose(isReconnect: boolean) {
        this.inputLock = true;
        if (!isReconnect) {
            this.showMsg("服务器已关闭", "red");
            tipsMgr.showDialog("服务器已关闭，点击确定刷新页面", this, () => {
                location.reload();
            }, null, "提示", true);
        } else {
            this.showMsg("正在重连...", "blue");
        }
    }

    onSocketError(event: Event) {
        tipsMgr.showAlert(JSON.stringify(event), "socket错误");
    }

    sendSocketMsg(msg: string) {
        socketMgr.send(msg);
    }
}

new index();