import QRCode from "qrcode";
import VConsole from "vconsole";

export class Utils {
    /**文件尺寸转换 */
    static formatSize(size: number): string {
        if (size < 1024) {
            return size + 'B';
        } else if (size < 1024 * 1024) {
            return (size / 1024).toFixed(2) + 'KB';
        } else if (size < 1024 * 1024 * 1024) {
            return (size / 1024 / 1024).toFixed(2) + 'MB';
        } else {
            return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB';
        }
    }

    /**时间戳转为时分秒 */
    static formatTime(timestamp: number): string {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }


    /**复制文本到剪切板 */
    static copyText(text: string) {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }

    /**复制文本到剪切板 ES6 还没普及呢 */
    static copyTextES6(text: string) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('复制成功');
        }).catch(() => {
            console.log('复制失败');
        });
    }

    /**从剪切板读取文本 */
    static readText(): Promise<string> {
        return navigator.clipboard.readText();
    }

    private static vs: VConsole;
    /**打开vconsle */
    static openVConsole() {
        if (!this.vs) {
            this.vs = new VConsole();
        }
        (<any>window)["closeVConsole"] = this.closeVConsole.bind(this);
    }

    /**关闭vconsole */
    static closeVConsole() {
        this.vs?.destroy();
    }

    /**新建二维码 */
    static createQRCode(text: string, size: number = 256): Promise<string> {
        return QRCode.toDataURL(text);
    }

    private static aHref: HTMLAnchorElement;
    /**下载文件 */
    static downloadFile(url: string, fileName: string) {
        if (!this.aHref) {
            this.aHref = document.createElement('a');
        }
        this.aHref.href = url;
        this.aHref.download = fileName;
        this.aHref.target = '_blank'; // 在当前页面中打开链接
        document.body.appendChild(this.aHref);
        this.aHref.click();
        document.body.removeChild(this.aHref);
    }

    /**创建控件 */
    static createControl(parent: HTMLElement, html: string, elementId: string, position: InsertPosition = "afterbegin") {
        parent.insertAdjacentHTML(position, html);
        return document.getElementById(elementId) as HTMLElement;
    }

}