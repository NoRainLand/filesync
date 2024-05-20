import { ProjectConfig } from "../ProjectConfig";
import { Config } from "./Config";
import { HtmlControl } from "./HtmlControl";
import { HttpMgr } from "./HttpMgr";
import { TipsMgr } from "./TipsMgr";
import { Utils } from "./Utils";

export class InputMgr {
    private static fileInput: HTMLInputElement;
    private static textInput: HTMLInputElement;
    private static uploadButton: HTMLButtonElement;
    private static pageParent: HTMLElement;


    private static _inputLock = false;
    static get inputLock(): boolean {
        return this._inputLock;
    }
    static set inputLock(value: boolean) {
        this._inputLock = value;
        this.uploadButton.value = value ? "发送中" : "发送";
        this.uploadButton.setAttribute('aria-busy', value.toString());
        this.textInput.placeholder = value ? "发送中…" : "等待输入…";
    }



    static init(pageParent: HTMLElement) {
        this.pageParent = pageParent;
        this.setUI();
        this.addEvent();
    }
    private static setUI() {
        let uploadForm: HTMLFormElement = Utils.createControl(this.pageParent, HtmlControl.uploadComponent, "uploadForm") as HTMLFormElement;
        this.fileInput = uploadForm.querySelector('#fileInput') as HTMLInputElement;
        this.textInput = uploadForm.querySelector('#textInput') as HTMLInputElement;
        this.uploadButton = uploadForm.querySelector('#uploadButton') as HTMLButtonElement;
    }
    private static addEvent() {
        this.uploadButton.addEventListener('click', this.sendMsg.bind(this));
    }

    private static removeEvent() {
        this.uploadButton.removeEventListener('click', this.sendMsg);
    }


    private static sendMsg() {
        let text = this.textInput.value;
        if (!text && !this.fileInput.files) {
            TipsMgr.showNotice('请选择文件或输入文本');
            return;
        }
        this.inputLock = true;
        const file = this.fileInput.files?.[0];
        const formData = new FormData();
        file && formData.append('file', file);
        formData.append('text', text);
        this.fileInput.disabled = true;
        this.textInput.disabled = true;
        this.sendHttpMsg(formData);
    }


    private static sendHttpMsg(formData: FormData) {
        HttpMgr.uploadMsg(formData, (event: ProgressEvent) => {
            if (event.lengthComputable) {
                if (event.total > Config.showProgressMinSize) {
                    TipsMgr.showProgress(event.loaded / event.total);
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
                    TipsMgr.showAlert(error.response.data, "发送失败");
                } else {
                    TipsMgr.showAlert(error.message, "发送失败");
                }
            })
            .finally(() => {
                setTimeout(() => {
                    this.inputLock = false;
                    TipsMgr.hideProgress();
                }, ProjectConfig.sendTimeout);
                this.fileInput.value = '';
                this.textInput.value = '';
                this.fileInput.disabled = false;
                this.textInput.disabled = false;
            });
    }

    static clear() {
        this.removeEvent();
    }
}