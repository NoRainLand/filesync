import { config } from "./config";
import { actionType, colorType, dialogType, msgType, socketInfoType } from "./dataType";
import { eventSystem } from "./eventSystem";
import { item } from "./item";
import { logger } from "./logger";
import { objectPool } from "./objectPool";

export class index {
    private socket: WebSocket;
    fileInput: any;
    textInput: any;
    statusText: any;
    text = '';
    uploadButton: HTMLButtonElement;
    fileList: HTMLElement;
    msgList: msgType[];
    itemPool: objectPool<item>;
    msgHashArr: Array<string>;

    itemList: item[];

    private aHref: HTMLAnchorElement;

    private maxReconnectAttempts = 3;
    private reconnectAttempts = 0;
    private reconnectInterval = 3000; // 3 seconds
    private timer: any;

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


    dialog: HTMLDialogElement;
    dialogTitle: HTMLHeadingElement;
    dialogContent: HTMLParagraphElement;
    dialogCloseButton: HTMLButtonElement;

    themeButtonSvg: HTMLElement;

    qrcodeButtonSvg: HTMLElement;

    qrcode: any;
    qrcodeDiv: HTMLElement;

    imgQrCode: HTMLImageElement;

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
        this.fileInput = document.getElementById('fileInput');
        this.textInput = document.getElementById('textInput');
        this.statusText = document.getElementById('statusText');
        this.uploadButton = document.getElementById('uploadButton') as HTMLButtonElement;
        this.dialog = document.querySelector('dialog') as HTMLDialogElement;
        this.dialogTitle = document.querySelector('dialog article header h6')!;
        this.dialogContent = document.querySelector('dialog article p')!;
        this.dialogCloseButton = document.querySelector('dialog article header a')!;
        this.fileList = document.getElementById('fileList') as HTMLUListElement;

        this.themeButtonSvg = document.getElementById('themeButton') as HTMLElement;
        this.initTheme();

        this.qrcodeButtonSvg = document.getElementById('qrcodeButton') as HTMLElement;

        this.qrcodeDiv = document.getElementById('qrcodeDiv') as HTMLElement;
        this.qrcode = new ((window as any).QRCode)("qrcodeDiv");
        this.imgQrCode = this.qrcodeDiv.getElementsByTagName("img")[0] as HTMLImageElement;

        this.inputLock = false;
        this.msgList = [];
        this.msgHashArr = [];
        this.itemList = [];
        this.itemPool = new objectPool(() => new item());
        this.getSocketInfo();
        this.addEvent();
        logger.tranLogger();
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

    getSocketInfo() {
        fetch('/getSocketInfo')
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.text();
            })
            .then(data => {
                let socketInfo: socketInfoType = JSON.parse(data);
                config.URL = socketInfo.socketURL;
                config.SocketIOPORT = socketInfo.socketPORT;
                config.version = socketInfo.version;
                this.initSocket();
                logger.log("当前版本" + config.version);
            })
            .catch(error => {
                console.warn(error);
                this.showTips("获取socket信息失败", "red");
            })
    }
    sendMsg() {
        let timeoutId: any = null;

        this.text = this.textInput.value;
        if (!this.fileInput!.files.length && !this.text) {
            this.showAlertOrDialog('请选择文件或输入文本');
            return;
        }
        this.inputLock = true;
        const file = this.fileInput!.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('text', this.text);
        this.fileInput.disabled = true;
        this.textInput.disabled = true;
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.text();
            })
            .then(data => {

            })
            .catch(error => {
                this.showAlertOrDialog("文件发送失败,可能因为服务器已经存在该文件", "发送失败");
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
    initSocket() {
        this.socket = new WebSocket(`ws://${config.URL}:${config.SocketIOPORT}`);

        this.socket.onmessage = (event) => {
            let data = event.data;
            data = JSON.parse(data);
            // console.log(data);
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
        this.socket.onopen = () => {
            // 向服务器发送一个请求所有数据的消息
            let data: actionType = { action: 'update' };
            this.socket.send(JSON.stringify(data));
            this.showTips("连接成功", "green");
            this.inputLock = false;
            this.reconnectAttempts = 0;
            if (this.timer) {
                clearInterval(this.timer);
            }
        }
        this.socket.onclose = () => {
            this.inputLock = true;
            setTimeout(() => {
                if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    this.showTips("服务器已关闭", "red");
                    console.warn("服务器已关闭");
                } else {
                    this.showTips("正在重连...", "blue");
                    this.initSocket();
                    this.reconnectAttempts++;
                }
            }, this.reconnectInterval);
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

        this.dialogCloseButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.dialog.close();
        });

        this.themeButtonSvg.addEventListener('click', () => {
            this.isDark = !this.isDark;
            this.initTheme();
        });

        this.qrcodeButtonSvg.addEventListener('click', () => {
            this.showAlertOrDialog(window.location.href, "当前网址", "qrcode");
        });
    }

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
        this.socket?.send(JSON.stringify(data));
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


    showTips(msg: string, color: colorType) {
        if (this.statusText) {
            this.statusText.textContent = msg;
            this.statusText.style.color = color;
        }
    }

    showAlertOrDialog(content: string, title: string = "提示", type: dialogType = "msg") {
        this.dialogTitle.textContent = title;
        if (type == "msg") {
            this.dialogContent.textContent = content;
            this.qrcode.clear();
            this.qrcodeDiv.className = config.hideQrcodeDivClass;
            if (this.imgQrCode) {
                this.imgQrCode.style.display = "none";
            }
        } else if (type == "qrcode") {
            this.dialogContent.textContent = "";
            this.qrcode.makeCode(content);
            this.qrcodeDiv.className = config.showQrcodeDivClass;
            if (this.imgQrCode) {
                this.imgQrCode.style.display = "block";
            }
        }
        this.dialog.showModal();
    }
}

new index();