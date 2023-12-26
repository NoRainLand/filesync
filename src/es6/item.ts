import { copyData } from "./copyData";
import { msgType } from "./dataType";
import { eventSystem } from "./eventSystem";

export class item {
    private element: HTMLDivElement;
    private text1: HTMLParagraphElement;
    private text2: HTMLParagraphElement;
    private button1: HTMLButtonElement;
    private button2: HTMLButtonElement;
    private button3: HTMLButtonElement;
    private data: msgType = null!;
    private onceInit: boolean = false;
    constructor() {

    }

    initItem() {
        if (!this.onceInit) {
            this.element = document.createElement('div');
            this.element.className = 'item';

            this.text1 = document.createElement('p');
            this.text2 = document.createElement('p');
            this.button1 = document.createElement('button');
            this.button2 = document.createElement('button');
            this.button3 = document.createElement('button');

            this.element.appendChild(this.text1);
            const buttonContainer = document.createElement('div');
            buttonContainer.appendChild(this.text2);
            buttonContainer.appendChild(this.button1);
            buttonContainer.appendChild(this.button2);
            buttonContainer.appendChild(this.button3);
            this.element.appendChild(buttonContainer);
            this.button1.textContent = '下载';
            this.button2.textContent = '复制';
            this.button3.textContent = '删除';
            this.onceInit = true;
        }

        this.button1.addEventListener('click', () => this.downloadFile());
        this.button2.addEventListener('click', () => this.copyData());
        this.button3.addEventListener('click', () => this.deleteData());
    }
    downloadFile(): void {
        eventSystem.emit('downloadFile', this.data.url, this.data.fileName);
    }

    copyData() {
        if (this.data) {
            const text = (this.data.text || this.data.url)!.toString();
            copyData.copyToClipboard(text);
        }
    }

    deleteData(): void {
        // 在这里实现删除数据的逻辑
        eventSystem.emit('deleteItem', this.data.fileOrTextHash!);
    }

    setData(data: msgType): void {
        this.data = data;
        this.initItem();
        // 显示 text 或 filename
        if (data.fileName) {
            this.text1.textContent = data.fileName;
        } else {
            let str = data.text!;
            if (str.length > 45) {
                str = str.slice(0, 45) + '[...]';
            }
            this.text1.textContent = str;
        }
        if (data.msgType === 'file') {
            this.button1.style.display = 'block';
            this.button2.style.display = 'none';
        } else {
            this.button1.style.display = 'none';
            this.button2.style.display = "block"
        }

        // 显示时间戳
        const date = new Date(data.timestamp);
        const formattedDate = `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        this.text2.textContent = formattedDate;


    }

    onRemoveItem(): void {
        this.element.parentNode!.removeChild(this.element);
        this.button1.removeEventListener('click', this.downloadFile);
        this.button2.removeEventListener('click', this.copyData);
        this.button3.removeEventListener('click', this.deleteData);
    }

    setMyParnet(parent: HTMLElement) {
        parent.insertBefore(this.element, parent.firstChild);
    }
}