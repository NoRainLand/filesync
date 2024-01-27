import { config } from "./config";
import { dialogType } from "./dataType";

export class tipsMgr {
    private static _body: HTMLElement;
    private static get body() {
        if (!this._body) {
            this._body = document.body;
        }
        return this._body;
    }


    private static _myAlert: myAlert;

    private static _myDialog: myDialog;

    static showTips(msg: string) {

    }

    static showDialog(content: string, caller: any, sure: Function | null, cancel: Function | null, title: string = "提示",) {
        if (!this._myDialog) {
            this._myDialog = new myDialog(this.body);
        }
        this._myDialog.showDialog(content, caller, sure, cancel, title);
    }
    static showAlert(content: string, title: string = "提示", type: dialogType = "msg", caller: any = null, callback: Function | null = null) {
        if (!this._myAlert) {
            this._myAlert = new myAlert(this.body);
        }
        this._myAlert.showAlert(content, title, type);
    }

}

class myDialog {
    private _html: string;
    private parent: HTMLElement;
    private dialog: HTMLDialogElement;
    private dialogTitle: HTMLHeadingElement;
    private dialogContent: HTMLParagraphElement;
    private dialogSureButton: HTMLAnchorElement;
    private dialogCancelButton: HTMLAnchorElement;
    private dialogCloseButton: HTMLButtonElement;
    private _caller: any;
    private _sure: Function | null;
    private _cancel: Function | null;
    constructor(parent: HTMLElement) {
        this.parent = parent;
        this._html = config.myDialog;
        this.init();
    }
    private init() {
        this.parent.insertAdjacentHTML("afterbegin", this._html);
        this.dialog = document.getElementById('myDialog') as HTMLDialogElement;

        this.dialogTitle = this.dialog.querySelector("article header h6")!;
        this.dialogContent = this.dialog.querySelector("article p")!;
        this.dialogCancelButton = this.dialog.querySelector("article footer a:first-child")!;
        this.dialogSureButton = this.dialog.querySelector("article footer a:last-child")!;
        this.dialogCloseButton = this.dialog.querySelector("article header a")!;

        this.dialogSureButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.dialog.close();
            this._sure?.call(this._caller);
            this._sure = null;
            this._caller = null;
        });

        this.dialogCancelButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.dialog.close();
            this._cancel?.call(this._caller);
            this._cancel = null;
            this._caller = null;
        });

        this.dialogCloseButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.dialog.close();
            this._cancel?.call(this._caller);
            this._cancel = null;
            this._caller = null;
        });
    }
    showDialog(content: string, caller: any, sure: Function | null, cancel: Function | null, title: string = "提示",) {
        this._caller = caller;
        this._sure = sure;
        this._cancel = cancel;
        this.dialogTitle.textContent = title;
        this.dialogContent.textContent = content;
        this.dialog.showModal();
    }

}

class myAlert {
    private _html: string;
    private qrcode: any;
    private parent: HTMLElement;
    private qrcodeDiv: HTMLElement;
    private imgQrCode: HTMLImageElement;
    private dialog: HTMLDialogElement;
    private dialogTitle: HTMLHeadingElement;
    private dialogContent: HTMLParagraphElement;
    private dialogCloseButton: HTMLButtonElement;
    private _caller: any;
    private _callback: Function | null;
    constructor(parent: HTMLElement) {
        this.parent = parent;
        this._html = config.myAlert;
        this.init();
    }
    private init() {
        this.parent.insertAdjacentHTML("afterbegin", this._html);
        this.dialog = document.getElementById('myAlert') as HTMLDialogElement;

        this.qrcodeDiv = this.dialog.querySelector('#qrcodeDiv') as HTMLElement;
        this.qrcode = new ((window as any).QRCode)(this.qrcodeDiv);
        this.imgQrCode = this.dialog.querySelector("#qrcodeDiv img") as HTMLImageElement;
        this.dialogTitle = this.dialog.querySelector("article header h6")!;
        this.dialogContent = this.dialog.querySelector("article p")!;
        this.dialogCloseButton = this.dialog.querySelector("article header a")!;

        this.dialogCloseButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.dialog.close();
            this._callback?.call(this._caller);
            this._callback = null;
            this._caller = null;
        });
    }


    showAlert(content: string, title: string = "提示", type: dialogType = "msg", caller: any = null, callback: Function | null = null) {
        this._caller = caller;
        this._callback = callback;
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