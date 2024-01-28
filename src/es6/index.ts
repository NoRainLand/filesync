import { config } from "./config";
import { actionType, colorType, msgType, socketInfoType } from "./dataType";
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

    //-------------item-----------------

    createItem(msg: msgType) {
        if (this.msgList.length > 100) {
            this.msgList.shift();
        }
        if (this.msgHashArr.indexOf(msg.fileOrTextHash) == -1) {
            let item = this.itemPool.get();
            item.setData(msg);
            item.setMyParnet(this.fileList);
            this.msgHashArr.push(msg.fileOrTextHash);
            this.msgList.unshift(msg);
            this.itemList.unshift(item);
        }
    }


    removeItem(fileOrTextHash: string) {
        for (let i = 0; i < this.msgList.length; i++) {
            if (this.msgList[i].fileOrTextHash == fileOrTextHash) {
                this.itemList[i].onRemoveItem();
                this.msgList.splice(i, 1);
                this.itemList.splice(i, 1);
                this.msgHashArr.splice(i, 1);
                break;
            }
        }
    }

    updateItem(msgs: { action: string, msgs: msgType[] }) {
        msgs.msgs.forEach((msg) => {
            this.createItem(msg);
        });
    }


    deleteItem(fileOrTextHash: string) {
        let data: actionType = { action: 'delete', fileOrTextHash: fileOrTextHash };
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
                socketMgr.initSocket(this.onSocketMessage.bind(this), this.onSocketOpen.bind(this), this.onSocketClose.bind(this));
                logger.log("当前版本" + config.version);
            })
            .catch((error) => {
                console.warn(error);
                this.showMsg("获取socket信息失败", "red");
            });
    }

    sendHttpMsg(formData: FormData) {
        httpMgr.sendMsg(formData)
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                tipsMgr.showAlert("文件发送失败,可能因为服务器已经存在该文件", "发送失败");
                console.warn(error);
            })
            .finally(() => {
                setTimeout(() => {
                    this.inputLock = false;
                }, this.sendTimeout);
                this.fileInput.value = '';
                this.textInput.value = '';
                this.fileInput.disabled = false;
                this.textInput.disabled = false;
            });
    }


    //-------------socket-----------------

    onSocketMessage(event: MessageEvent) {
        let data = event.data;
        data = JSON.parse(data);
        switch (data.action) {
            case "add":
                this.createItem(data);
                break;
            case "delete":
                this.removeItem(data.fileOrTextHash);
                break;
            case "update":
                this.updateItem(data);
                break;
        }
    }

    onSocketOpen() {
        this.showMsg("连接成功", "green");
        this.inputLock = false;
        // 向服务器发送一个请求所有数据的消息
        let data: actionType = { action: 'update' };
        this.sendSocketMsg(JSON.stringify(data));
    }

    onSocketClose(isReconnect: boolean) {
        this.inputLock = true;
        if (!isReconnect) {
            this.showMsg("服务器已关闭", "red");
        } else {
            this.showMsg("正在重连...", "blue");
        }
    }

    sendSocketMsg(msg: string) {
        socketMgr.send(msg);
    }
}

new index();