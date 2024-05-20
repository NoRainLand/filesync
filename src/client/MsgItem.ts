import { MsgData } from "../common/CommonDefine";
import { EventMgr } from "../common/EventMgr";

export class MsgItem {
    private element: HTMLDivElement;
    private txtNameOrText: HTMLParagraphElement;
    private txtDate: HTMLParagraphElement;
    private btnDownload: HTMLButtonElement;
    private btnCopy: HTMLButtonElement;
    private btnDel: HTMLButtonElement;
    private data: MsgData | null;
    private onceInit: boolean = false;
    private maxTextLength = 30;
    constructor() {

    }

    initItem() {
        if (!this.onceInit) {
            this.element = document.createElement('div');
            this.element.className = 'item';

            this.txtNameOrText = document.createElement('p');
            this.txtDate = document.createElement('p');
            this.btnDownload = document.createElement('button');
            this.btnCopy = document.createElement('button');
            this.btnCopy.className = "btnCopy";

            this.btnDel = document.createElement('button');


            this.element.appendChild(this.txtNameOrText);
            const buttonContainer = document.createElement('div');

            buttonContainer.appendChild(this.txtDate);
            buttonContainer.appendChild(this.btnDownload);
            buttonContainer.appendChild(this.btnCopy);
            buttonContainer.appendChild(this.btnDel);

            this.element.appendChild(buttonContainer);

            this.btnDownload.textContent = '下载';
            this.btnCopy.textContent = '复制';
            this.btnDel.textContent = '删除';
            this.onceInit = true;
        }

        this.addEvent();
    }
    addEvent() {
        this.btnDownload.addEventListener('click', this.downloadFile.bind(this));
        this.btnCopy.addEventListener('click', this.copyData.bind(this));
        this.btnDel.addEventListener('click', this.deleteData.bind(this));
    }
    removeEvent() {
        this.btnDownload.removeEventListener('click', this.downloadFile);
        this.btnCopy.removeEventListener('click', this.copyData);
        this.btnDel.removeEventListener('click', this.deleteData);
    }

    downloadFile(): void {
        EventMgr.emit('downloadFile', this.data!.url, this.data!.fileName);
    }

    copyData() {
        if (this.data) {
            const text = (this.data.text || this.data.url)!.toString();
            this.btnCopy.setAttribute('data-clipboard-text', text);
        }
    }

    deleteData(): void {
        EventMgr.emit('deleteItem', this.data!.fileOrTextHash!);
    }

    setData(data: MsgData): void {
        this.data = data;
        this.initItem();

        // 显示 text 或 filename
        if (data.fileName) {
            let str = data.fileName;
            if (str.length > this.maxTextLength) {
                let index = str.lastIndexOf('.');
                if (index > 0) {
                    let ext = str.slice(index);
                    str = str.slice(0, this.maxTextLength - ext.length) + '[...]' + ext;
                } else {
                    str = str.slice(0, this.maxTextLength - 6) + '[...]' + str.slice(-6);
                }
            }
            this.txtNameOrText.textContent = str;
        } else {
            let str = data.text!;
            if (str.length > this.maxTextLength) {
                str = str.slice(0, this.maxTextLength) + '[...]';
            }
            this.txtNameOrText.textContent = str;
        }

        if (data.msgType === 'file') {
            this.btnDownload.style.display = 'block';
            this.btnCopy.style.display = 'none';
        } else {
            this.btnDownload.style.display = 'none';
            this.btnCopy.style.display = "block"
        }

        if (data.size != void 0 && data.size > 0) {
            this.txtNameOrText.setAttribute("data-tooltip", "文件大小：" + this.reSize(data.size));
            this.txtNameOrText.style.borderBottom = 'none';
        } else {
            this.txtNameOrText.removeAttribute("data-tooltip");
        }

        // 显示时间戳
        this.txtDate.textContent = this.tranDate(data.timestamp);
    }

    tranDate(timestamp: number): string {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }

    reSize(size: number): string {
        if (size >= 1024 * 1024) {
            return (size / 1024 / 1024).toFixed(2) + "GB";
        } else if (size >= 1024) {
            return (size / 1024).toFixed(2) + "MB";
        } else {
            return Math.ceil(size) + "KB";
        }
    }


    clear(): void {
        this.data = null;
        this.element.parentNode!.removeChild(this.element);
        this.removeEvent();
    }

    setMyParnet(parent: HTMLElement) {
        parent.insertBefore(this.element, parent.firstChild);
    }
}