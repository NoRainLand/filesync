import { AlertType } from "./ClientDefine";
import { HtmlControl } from "./HtmlControl";
import { TipsMgr } from "./TipsMgr";
import { Utils } from "./Utils";

export class QRCodeButton {
    private static pageParent: HTMLElement | null;
    private static qrcodeButtonSvg: HTMLElement
    static init(pageParent: HTMLElement) {
        this.pageParent = pageParent;
        this.setUI();
        this.addEvent();
    }
    private static setUI() {
        this.qrcodeButtonSvg = Utils.createControl(this.pageParent!, HtmlControl.qrcodeButton, "qrcodeButton", "beforeend");
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