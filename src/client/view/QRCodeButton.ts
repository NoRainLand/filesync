import { AlertType } from "../config/ClientDefine";
import { HtmlControl } from "../config/HtmlControl";
import { Utils } from "../utils/Utils";
import { TipsMgr } from "./TipsMgr";

export class QRCodeButton {
    private static pageParent: HTMLElement | null;
    private static qrcodeButtonSvg: HTMLElement
    static init(pageParent: HTMLElement) {
        this.pageParent = pageParent;
        this.setUI();
        this.addEvent();
    }
    private static setUI() {
        this.qrcodeButtonSvg = Utils.createConnonControl(this.pageParent!, HtmlControl.qrcodeButton, "qrcodeButton");
    }
    private static addEvent() {
        this.qrcodeButtonSvg.addEventListener('click', this.onShowQRCode.bind(this));
    }
    private static removeEvent() {
        this.qrcodeButtonSvg.removeEventListener('click', this.onShowQRCode);
    }
    private static onShowQRCode() {
        TipsMgr.showAlert(window.location.href, "当前网址", AlertType.qrcode);
    }
    static clear() {
        this.pageParent?.removeChild(this.qrcodeButtonSvg);
        this.pageParent = null;
        this.removeEvent();
    }
}