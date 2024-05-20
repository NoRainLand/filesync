import { Pool } from "../../common/Pool";
import { AlertType } from "../config/ClientDefine";
import { HtmlControl } from "../config/HtmlControl";
import { Utils } from "../utils/Utils";

export class TipsMgr {
    private static _body: HTMLElement;
    private static get body() {
        if (!this._body) {
            this._body = document.body;
        }
        return this._body;
    }


    private static _myAlert: Alert;

    private static _myDialog: Dialog;

    private static _myTips: Notice;

    private static _myProgress: Progress;


    /**显示一个提示 */
    static showNotice(msg: string) {
        if (!this._myTips) {
            this._myTips = new Notice(this.body);
        }
        this._myTips.show(msg);
    }

    /**显示一个对话框 */
    static showDialog(content: string, caller: any, sure: Function | null, cancel: Function | null, title: string = "提示", onlySure: boolean = false) {
        if (!this._myDialog) {
            this._myDialog = new Dialog(this.body);
        }
        this.hideAll();
        this._myDialog.show(content, caller, sure, cancel, title, onlySure);
    }

    /**隐藏对话框 */
    static hideDialog() {
        if (this._myDialog) {
            this._myDialog.close();
        }
    }

    /**显示一个提示框 */
    static showAlert(content: string, title: string = "提示", type: AlertType = AlertType.text, caller: any = null, callback: Function | null = null) {
        if (!this._myAlert) {
            this._myAlert = new Alert(this.body);
        }
        this._myAlert.show(content, title, type);
    }

    /**隐藏提示框 */
    static hideAlert() {
        if (this._myAlert) {
            this._myAlert.close();
        }
    }

    /**显示进度条 */
    static showProgress(value: number, autoClose: boolean = false) {
        if (!this._myProgress) {
            this._myProgress = new Progress(this.body);
        }
        this._myProgress.show(value, autoClose);
    }

    /**隐藏进度条 */
    static hideProgress() {
        if (this._myProgress) {
            this._myProgress.close();
        }
    }

    /**隐藏所有提示 */
    static hideAll() {
        this.hideDialog();
        this.hideAlert();
        this.hideProgress();
    }
}

class UIControl {
    init(): void { };
    show(...args: any[]): void { };
    close(): void { };
}

class Dialog extends UIControl {

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
        super();
        this.parent = parent;
        this.init();
    }
    init() {
        this.dialog = Utils.createConnonControl(this.parent, HtmlControl.Dialog, "myDialog") as HTMLDialogElement;


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
    show(content: string, caller: any, sure: Function | null, cancel: Function | null, title: string = "提示", onlySure: boolean = false) {
        this._caller = caller;
        this._sure = sure;
        this._cancel = cancel;
        this.dialogTitle.textContent = title;
        this.dialogContent.textContent = content;
        if (onlySure) {
            this.dialogCancelButton.style.display = "none";
            this.dialogCloseButton.style.display = "none";
        } else {
            this.dialogCancelButton.style.display = "inline-block";
            this.dialogCloseButton.style.display = "inline-block";
        }
        if (this.dialog.open) {
            this.dialog.close();
        }
        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
    }
}

class Alert extends UIControl {


    private parent: HTMLElement;
    private qrcodeDiv: HTMLImageElement;
    private imgQrCode: HTMLImageElement;
    private dialog: HTMLDialogElement;
    private dialogTitle: HTMLHeadingElement;
    private dialogContent: HTMLParagraphElement;
    private dialogCloseButton: HTMLButtonElement;
    private _caller: any;
    private _callback: Function | null;
    constructor(parent: HTMLElement) {
        super();
        this.parent = parent;
        this.init();
    }
    init() {
        this.dialog = Utils.createConnonControl(this.parent, HtmlControl.Alert, "myAlert") as HTMLDialogElement;

        this.qrcodeDiv = this.dialog.querySelector('#qrcodeDiv') as HTMLImageElement;
        this.imgQrCode = this.dialog.querySelector("#qrcodeImg") as HTMLImageElement;
        this.dialogTitle = this.dialog.querySelector("article header p strong")!;
        this.dialogContent = this.dialog.querySelectorAll("article p")[1]! as HTMLParagraphElement;
        this.dialogCloseButton = this.dialog.querySelector("article header button")!;
        this.dialogCloseButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.dialog.close();
            this._callback?.call(this._caller);
            this._callback = null;
            this._caller = null;
        });
    }


    show(content: string, title: string = "提示", type: AlertType = AlertType.text, caller: any = null, callback: Function | null = null) {
        this._caller = caller;
        this._callback = callback;
        this.dialogTitle.innerText = title;
        if (type == AlertType.text) {
            this.dialogContent.innerText = content;
            this.qrcodeDiv.className = HtmlControl.hideQrcodeDivClass;
            if (this.imgQrCode) {
                this.imgQrCode.style.display = "none";
            }
        } else if (type == AlertType.qrcode) {
            this.dialogContent.innerText = "";
            this.qrcodeDiv.className = HtmlControl.showQrcodeDivClass;

            if (this.imgQrCode) {
                Utils.createQRCode(content)
                    .then((url) => {
                        this.imgQrCode.src = url;
                        this.imgQrCode.style.display = "block";
                    })
                    .catch((err) => {
                        this.show(content, title, AlertType.text, caller, callback);
                        console.error(err);
                    });
            }
        }
        if (this.dialog.open) {
            this.dialog.close();
        }
        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
    }
}

class Notice extends UIControl {

    private parent: HTMLElement;
    private showIngTips: HTMLElement[];
    private tipsPool: Pool<HTMLElement>;
    constructor(parent: HTMLElement) {
        super();
        this.parent = parent;
        this.showIngTips = [];
        this.tipsPool = new Pool<HTMLElement>(this.createTips);
    }
    init() { };

    show(msg: string) {
        let tips = this.tipsPool.get();
        this.showIngTips.push(tips);
        this.parent.appendChild(tips);
        tips.textContent = msg;


        tips.style.position = 'fixed';
        tips.style.left = '50%';
        tips.style.top = '50%';
        tips.style.transform = 'translate(-50%, -50%)';
        tips.style.transition = 'all 1.0s ease-in-out';//平滑过渡

        tips.style.opacity = '0.75';
        let self = this;

        (<any>tips)["startTime"] = setTimeout(() => {
            tips.style.top = '30%';
            tips.style.opacity = '0';
            (<any>tips)["holdTime"] = setTimeout(() => {
                self.recoverTips(tips);
            }, 1000);
        }, 1000);
    }

    close(): void {
        this.showIngTips.forEach((tips) => {
            this.recoverTips(tips);
        });
    }

    private createTips(): HTMLElement {
        let tips = document.createElement("article");
        tips.className = "tips";
        tips.style.borderRadius = "10px";
        return tips;
    }
    private recoverTips(tips: HTMLElement) {
        if (this.parent.contains(tips)) {
            this.parent.removeChild(tips);
        }
        if ((<any>tips)["startTime"]) {
            clearTimeout((<any>tips)["startTime"]);
            clearTimeout((<any>tips)["holdTime"]);
            (<any>tips)["startTime"] = null;
            (<any>tips)["holdTime"] = null;
        }
        tips.textContent = "";
        this.showIngTips.push(tips);
    }
}

class Progress extends UIControl {

    private parent: HTMLElement;
    private progress: HTMLDialogElement;
    private progressCard: HTMLElement;
    private progressValue: HTMLProgressElement;
    private myProgressText: HTMLSpanElement;
    constructor(parent: HTMLElement) {
        super();
        this.parent = parent;
        this.init();
    }
    init() {
        this.progress = Utils.createConnonControl(this.parent, HtmlControl.Progress, "myProgress") as HTMLDialogElement;

        this.progressCard = this.progress.querySelector('#myProgressCard') as HTMLDListElement;
        this.progressValue = this.progress.querySelector('#myProgressValue') as HTMLProgressElement;
        this.myProgressText = this.progress.querySelector('#myProgressText') as HTMLSpanElement;

        this.progressCard.style.position = 'fixed';
        this.progressCard.style.left = '50%';
        this.progressCard.style.top = '50%';
        this.progressCard.style.transform = 'translate(-50%, -50%)';
        this.progressCard.style.width = "30%";
    }

    show(value: number, autoClose: boolean = false) {
        value = value * 100;
        value = value > 99.9 ? 99.9 : value;
        value = value < 0 ? 0 : value;
        this.progressValue.value = value;
        this.myProgressText.textContent = `文件上传中，进度：${value.toFixed(1)}%`;
        if (!this.progress.open) {
            this.progress.showModal();
        }
        if (autoClose) {
            if (value >= 99.9) {
                this.close();
            }
        }
    }
    close() {
        this.myProgressText.textContent = "0%";
        this.progressValue.value = 0;
        this.progress.close();
    }
}