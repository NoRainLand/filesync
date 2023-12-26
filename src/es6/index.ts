import { config } from "./config";
import { actionType, colorType, msgType } from "./dataType";
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

    private inputLock = false;
    constructor() {
        this.init();
    }

    init() {
        this.fileInput = document.getElementById('fileInput');
        this.textInput = document.getElementById('textInput');
        this.statusText = document.getElementById('statusText');
        this.uploadButton = document.getElementById('uploadButton') as HTMLButtonElement;
        this.uploadButton.value = "发送";
        this.textInput.placeholder = "等待输入……";
        this.fileList = document.getElementById('fileList') as HTMLUListElement;
        this.msgList = [];
        this.msgHashArr = [];
        this.itemList = [];
        this.itemPool = new objectPool(() => new item());
        // this.initSocket();
        this.getSocketInfo();
        this.addEvent();
        logger.tranLogger();
    }

    getSocketInfo() {
        fetch('/getSocketInfo')
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                console.log(response);
                return response.text();
            })
            .then(data => {
                console.log(data);
                let socketInfo: { "socketURL": string, "socketPORT": number } = JSON.parse(data);
                config.URL = socketInfo.socketURL;
                config.SocketIOPORT = socketInfo.socketPORT;
                this.initSocket();
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
            return alert('请选择文件或输入文本');
        }
        this.inputLock = true;
        const file = this.fileInput!.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('text', this.text);
        this.showTips("发送中", "blue");
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
                this.inputLock = false;
                this.showTips("发送成功", "green");
                // 清空文件输入元素和文本输入元素的值
                this.fileInput.value = '';
                this.textInput.value = '';
                timeoutId = setTimeout(() => {
                    this.showTips("等待发送...", "gray");
                }, 3000);
            })
            .catch(error => {
                console.warn(error);
                this.showTips("发送失败,文件已存在", "red");
                if (error.message.startsWith('File already uploaded') || error.message.startsWith('Text already uploaded')) {
                    // 清空文件输入元素和文本输入元素的值
                    this.fileInput.value = '';
                    this.textInput.value = '';
                }
            })
            .finally(() => {
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
            // console.log("收到消息")
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
            console.log("连接成功");
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
                    this.showTips("连接失败，正在重连...", "blue");
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
                // 在这里添加你的上传或发送文件的代码
                if (!this.inputLock) {
                    this.sendMsg();
                }
            }
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
}

new index();