import Clipboard from "clipboard";
import QRCode from "qrcode";

export class Utils {
    /**文件尺寸转换 */
    static formatSize(size: number): string {
        if (size < 1024) {
            return Math.floor(size) + 'KB';
        } else if (size < 1024 * 1024) {
            return (size / 1024).toFixed(2) + 'MB';
        } else {
            return (size / 1024 / 1024).toFixed(2) + 'GB';
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
    static copyTextByClipboard(node: string, callback: Function) {
        let cp = new Clipboard(node);
        cp.on('success', function (e) {
            e.clearSelection();
            callback?.();
        });
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


    private static canvasElement: HTMLCanvasElement;
    /**新建二维码 */
    static createQRCode(text: string, darkColor: string = "#000000", lightColor: string = "#ffffff"): Promise<string> {
        let opts = {
            quality: 0.3,
            margin: 1,
            color: {
                dark: darkColor,
                light: lightColor
            },
            width: 256, // 设置宽度
        }
        //创建离屏画布
        if (!this.canvasElement) {
            this.canvasElement = document.createElement('canvas');
        }
        return QRCode.toDataURL(this.canvasElement, text, opts)
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
    static createConnonControl(parent: HTMLElement, html: string, elementId: string, position: InsertPosition = "afterbegin") {
        let obj = parent.insertAdjacentHTML(position, html);
        return document.getElementById(elementId) as HTMLElement;
    }


    private static div: HTMLDivElement;
    /**直接创建 */
    static createControlByHtml(html: string) {
        if (!this.div) {
            this.div = document.createElement('div');
        }
        this.div.innerHTML = html;
        let ch = this.div.firstElementChild;
        this.div.removeChild(ch!);
        return ch;
    }

    private static moueseUpEvent: MouseEvent;
    static get mouseUpEvent() {
        if (!this.moueseUpEvent) {
            this.moueseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            Object.freeze(this.moueseUpEvent);
        }
        return this.moueseUpEvent;
    }

    /**手动兼容一下火狐 */
    static fixMinWidth() {
        let u = window.navigator.userAgent;
        if (u.indexOf('Firefox') > -1) {
            document.body.style.minWidth = "1200px";
        } else {
            document.body.style.minWidth = "980px";
        }
    }



    /**文件类型的后缀 */
    static readonly fileType2Sfx:{ [key: string]: string[] } = {
        img: [
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".bmp",
            ".webp",
            ".svg",
            ".ico",
        ],
        video: [
            ".mp4",
            ".webm",
            ".ogg",
            ".avi",
            ".wmv",
            ".rmvb",
            ".flv",
            ".mov",
            ".3gp",
        ],
        audio: [
            ".mp3",
            ".wav",
            ".flac",
            ".ape",
            ".wma",
            ".aac",
            ".ogg",
        ],
    }

    /**后缀的文件类型 */
    static suffix2Type: { [key: string]: string };

    /**是否为常见的文件 */
    static isCommonFile(sfx: string): string {
        if (!this.suffix2Type) {
            this.suffix2Type = {};
            for (let key in this.fileType2Sfx) {
                let arr = this.fileType2Sfx[key];
                arr.forEach((sfx:string) => {
                    this.suffix2Type[sfx] = key;
                })
            }
        }
        return this.suffix2Type[sfx] ? this.suffix2Type[sfx] : "other";
    }


}