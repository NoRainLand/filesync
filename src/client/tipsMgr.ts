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

    private static _myTips: myTips;

    private static _myProgress: myProgress;

    static showTips(msg: string) {
        if (!this._myTips) {
            this._myTips = new myTips(this.body);
        }
        this._myTips.showTips(msg);
    }

    static showDialog(content: string, caller: any, sure: Function | null, cancel: Function | null, title: string = "提示", onlySure: boolean = false) {
        if (!this._myDialog) {
            this._myDialog = new myDialog(this.body);
        }
        this.hideAll();
        this._myDialog.show(content, caller, sure, cancel, title, onlySure);
    }

    static hideDialog() {
        if (this._myDialog) {
            this._myDialog.close();
        }
    }

    static showAlert(content: string, title: string = "提示", type: dialogType = "msg", caller: any = null, callback: Function | null = null) {
        if (!this._myAlert) {
            this._myAlert = new myAlert(this.body);
        }
        this._myAlert.show(content, title, type);
    }

    static hideAlert() {
        if (this._myAlert) {
            this._myAlert.close();
        }
    }

    static showProgress(value: number, autoClose: boolean = false) {
        if (!this._myProgress) {
            this._myProgress = new myProgress(this.body);
        }
        this._myProgress.show(value, autoClose);
    }
    static hideProgress() {
        if (this._myProgress) {
            this._myProgress.close();
        }
    }

    static hideAll() {
        this.hideDialog();
        this.hideAlert();
        this.hideProgress();
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


    show(content: string, title: string = "提示", type: dialogType = "msg", caller: any = null, callback: Function | null = null) {
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
        if (this.dialog.open) {
            this.dialog.close();
        }
        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
    }
}

class myTips {
    private parent: HTMLElement;
    private tipsPoor: HTMLElement[];
    constructor(parent: HTMLElement) {
        this.parent = parent;
        this.tipsPoor = [];
    }

    showTips(msg: string) {
        let tips = this.createTips();
        this.parent.appendChild(tips);
        tips.textContent = msg;


        tips.style.position = 'fixed';
        tips.style.left = '50%';
        tips.style.top = '50%';
        tips.style.transform = 'translate(-50%, -50%)';
        tips.style.transition = 'all 1.0s ease-in-out';//平滑过渡

        tips.style.opacity = '0.75';
        let self = this;
        setTimeout(() => {
            tips.style.top = '30%';
            tips.style.opacity = '0';
            setTimeout(() => {
                self.recoverTips(tips);
            }, 1000);
        }, 1000);

    }

    private createTips(): HTMLElement {
        let tips = this.tipsPoor.pop();
        if (!tips) {
            tips = document.createElement("article");
            tips.className = "tips";
            tips.style.borderRadius = "10px";
        }
        return tips;
    }
    private recoverTips(tips: HTMLElement) {
        if (this.parent.contains(tips)) {
            this.parent.removeChild(tips);
        }
        tips.textContent = "";
        this.tipsPoor.push(tips);
    }
}

class myProgress {
    private _html: string;
    private parent: HTMLElement;
    private progress: HTMLDialogElement;
    private progressCard: HTMLElement;
    private progressValue: HTMLProgressElement;
    private myProgressText: HTMLSpanElement;
    constructor(parent: HTMLElement) {
        this.parent = parent;
        this._html = config.myProgress;
        this.init();
    }
    private init() {
        this.parent.insertAdjacentHTML("afterbegin", this._html);
        this.progress = document.getElementById('myProgress') as HTMLDialogElement;
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