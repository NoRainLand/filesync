import { MsgData } from "../../common/CommonDefine";
import { EventMgr } from "../../common/EventMgr";
import { BtnEvent } from "../config/ClientDefine";
import { HtmlControl } from "../config/HtmlControl";
import { Utils } from "../utils/Utils";
import { TipsMgr } from "./TipsMgr";

export class MsgItem {
    private form: HTMLFormElement;
    private txtNameOrText: HTMLParagraphElement;
    private txtDate: HTMLParagraphElement;
    private btnDownload: HTMLButtonElement;
    private btnCopy: HTMLButtonElement;
    private btnDel: HTMLButtonElement;
    private data: MsgData | null;
    private maxTextLength = 30;
    constructor() {

    }

    initItem(parent: HTMLElement) {
        if (!this.form) {
            this.form = Utils.createControlByHtml(HtmlControl.fileItem) as HTMLFormElement;
            this.txtNameOrText = this.form.querySelector('p') as HTMLParagraphElement;
            this.txtDate = this.form.querySelector('div small') as HTMLParagraphElement;
            this.btnDownload = this.form.querySelector('div .downloadFile') as HTMLButtonElement;
            this.btnCopy = this.form.querySelector('div .copyMsg') as HTMLButtonElement;
            this.btnDel = this.form.querySelector('div .deleteMsg') as HTMLButtonElement;
        }
        this.addEvent();
        this.setMyParnet(parent);

    }
    addEvent() {
        this.btnDownload.addEventListener('click', this.downloadFile);
        this.btnCopy.addEventListener('click', this.copyData);
        this.btnDel.addEventListener('click', this.deleteData);
    }
    removeEvent() {
        this.btnDownload.removeEventListener('click', this.downloadFile);
        this.btnCopy.removeEventListener('click', this.copyData);
        this.btnDel.removeEventListener('click', this.deleteData);
    }

    /**是否为常见的文件 */
    isCommonFile(fileName: string): string {
        let sfx = fileName.slice(fileName.lastIndexOf('.'));
        return Utils.isCommonFile(sfx);
    }


    downloadFile = () => {
        let fileName = this.data!.fileName!;
        let type = this.isCommonFile(fileName);
        if (type === 'img') {
            TipsMgr.showImgPreview(this.data!.url!);
        } else if (type === 'video') {
            TipsMgr.showVideoPreview(this.data!.url!);
        } else if (type === 'audio') {
            TipsMgr.showAudioPreview(this.data!.url!);
        } else {
            EventMgr.emit(BtnEvent.downloadFile, this.data!.url, this.data!.fileName);
        }
    }

    copyData = () => {
        // if (this.data) {
        //     if (this.data.fileName) {
        //         Utils.copyText(this.data.fileName);
        //     } else {
        //         Utils.copyText(this.data.text!);
        //     }
        // }
        if (this.data) {
            const text = (this.data.text || this.data.url)!.toString();
            this.btnCopy.setAttribute('data-clipboard-text', text);
        }
    }

    deleteData = () => {
        if (this.data?.fileOrTextHash) {
            EventMgr.emit(BtnEvent.deleteItem, this.data.fileOrTextHash);
        }
    }

    setData(data: MsgData, parent: HTMLElement): void {
        this.data = data;
        this.initItem(parent);

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


            let type = this.isCommonFile(data.fileName);
            if (type === 'img' || type === 'video' || type === 'audio') {
                this.btnDownload.innerText = '预览';
            } else {
                this.btnDownload.innerText = '下载';
            }

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
            this.txtNameOrText.setAttribute("data-tooltip", "文件大小：" + Utils.formatSize(data.size));
            this.txtNameOrText.style.borderBottom = 'none';
        } else {
            this.txtNameOrText.removeAttribute("data-tooltip");
        }

        // 显示时间戳
        this.txtDate.textContent = Utils.formatTime(data.timestamp);
    }


    clear(): void {
        this.data = null;
        this.form?.parentNode?.removeChild(this.form);
        this.removeEvent();
        this.btnCopy.removeAttribute('data-clipboard-text');
        this.txtNameOrText.removeAttribute("data-tooltip");
    }

    setMyParnet(parent: HTMLElement) {
        if (parent && this.form) {
            parent.insertBefore(this.form, parent.firstChild);
        }
    }
}