import { ProjectConfig } from "../../ProjectConfig";
import { Color, InputStatus } from "../config/ClientDefine";
import { Config } from "../config/Config";
import { HtmlControl } from "../config/HtmlControl";
import { NetMgr } from "../net/NetMgr";
import { Utils } from "../utils/Utils";
import { TipsMgr } from "./TipsMgr";

export class InputMgr {
    private static fileInput: HTMLInputElement;
    private static textInput: HTMLInputElement;
    private static uploadButton: HTMLInputElement;
    private static pageParent: HTMLElement;


    private static _inputStatus: InputStatus = InputStatus.nul;

    static get inputStatus() {
        return this._inputStatus;
    }

    static get static() {
        return this.inputStatus;
    }

    static changeStatus(status: InputStatus) {
        if (this.inputStatus === status) return;
        this._inputStatus = status;
        switch (status) {
            case InputStatus.loading:
                this.inputLock = true;
                this.uploadButton.value = "加载中";
                this.textInput.placeholder = "正在加载中";
                this.uploadButton.style.backgroundColor = Color.blue;
                this.uploadButton.style.borderColor = Color.blue;
                break;
            case InputStatus.sending:
                this.inputLock = true;
                this.uploadButton.value = "发送中";
                this.textInput.placeholder = "正在发送中";
                this.uploadButton.style.backgroundColor = Color.yellow;
                this.uploadButton.style.borderColor = Color.yellow;
                break;
            case InputStatus.error:
                this.inputLock = true;
                this.uploadButton.value = "错误";
                this.textInput.placeholder = "网络发生错误";
                this.uploadButton.style.backgroundColor = Color.red;
                this.uploadButton.style.borderColor = Color.red;
                break;
            case InputStatus.waiting:
                this.inputLock = false;
                this.uploadButton.value = "发送";
                this.textInput.placeholder = "等待输入中";
                this.uploadButton.style.backgroundColor = Color.green;
                this.uploadButton.style.borderColor = Color.green;
                break;
        }
    }
    private static inputLock = false;


    static init(pageParent: HTMLElement) {
        this.pageParent = pageParent;
        this._inputStatus = InputStatus.nul;
        this.setUI();
        this.addEvent();
    }
    private static setUI() {
        let uploadForm: HTMLFormElement = Utils.createConnonControl(this.pageParent, HtmlControl.uploadComponent, "uploadForm") as HTMLFormElement;
        this.fileInput = uploadForm.querySelector('#fileInput') as HTMLInputElement;
        this.textInput = uploadForm.querySelector('#textInput') as HTMLInputElement;
        this.uploadButton = uploadForm.querySelector('#uploadButton') as HTMLInputElement;
    }
    private static addEvent() {
        this.uploadButton.addEventListener('click', this.sendMsg);
    }

    private static removeEvent() {
        this.uploadButton.removeEventListener('click', this.sendMsg);
    }

    /**发送文件或者文字 */
    private static sendMsg = () => {
        if (this.inputLock) return;
        let text = this.textInput.value;
        if (!text && (!this.fileInput.files || !this.fileInput.files.length)) {
            TipsMgr.showNotice('请选择文件或输入文本');
            return;
        }

        this.inputLock = true;
        this.changeStatus(InputStatus.sending);
        const file = this.fileInput.files?.[0];
        const formData = new FormData();
        file && formData.append('file', file);
        formData.append('text', text);
        this.fileInput.disabled = true;
        this.textInput.disabled = true;
        this.sendHttpMsg(formData);
    }


    private static sendHttpMsg(formData: FormData) {
        NetMgr.uploadMsg(formData, (event: ProgressEvent) => {
            if (event.lengthComputable) {
                if (event.total > Config.showProgressMinSize) {
                    TipsMgr.showProgress(event.loaded / event.total);
                }
            }
        })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                TipsMgr.showAlert(error, "上传失败");
            })
            .finally(() => {
                setTimeout(() => {
                    if (this.inputStatus === InputStatus.sending) {
                        this.changeStatus(InputStatus.waiting);
                    }
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