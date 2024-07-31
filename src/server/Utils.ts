import { exec } from 'child_process';
import fs from 'fs';
import * as os from 'os';
import path from 'path';
export class Utils {
    /**获取本机IP */
    static getLocalIP() {
        const interfaces = os.networkInterfaces();
        for (let devName in interfaces) {
            let iface = interfaces[devName];
            for (let i = 0; i < iface!.length; i++) {
                let alias = iface![i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
        console.warn("无法获取本机IP地址");
        return '127.0.0.1';
    }
    /**检查目录是否存在,不存在就创建 */
    static checkDirExist(path: string) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    /**获取相对代码运行的路径 */
    static getRelativePath(sourcePath: string, extraPath: string = "") {
        if ((<any>process).pkg) {
            return path.join(process.cwd(), sourcePath.substring(1));//因为打包之后执行路径会变成相对.exe文件的路径，所以需要减少一位 "."。
        } else {
            return path.join(__dirname, extraPath, sourcePath);
        }
    }

    /**打开浏览器 */
    static openBrowser(url: string) {
        switch (process.platform) {
            case "win32":
                exec(`start ${url}`);
                break;
            case "darwin":
                exec(`open ${url}`);
                break;
            default:
                exec(`xdg-open ${url}`);
        }
    }


    /**处理base64的编码格式 */
    static decodeMimeEncodedString(encodedString: string): string {
        const mimePattern = /=\?([^?]+)\?([BQ])\?([^?]+)\?=/i;
        const matches = mimePattern.exec(encodedString);

        if (!matches) {
            return encodedString;
        }

        const charset: any = matches[1];
        const encoding = matches[2].toUpperCase();
        const encodedText = matches[3];

        let decodedText: string;

        if (encoding === 'B') {
            decodedText = Buffer.from(encodedText, 'base64').toString(charset);
        } else if (encoding === 'Q') {
            decodedText = encodedText.replace(/_/g, ' ').replace(/=([A-Fa-f0-9]{2})/g, (match, hex) => {
                return String.fromCharCode(parseInt(hex, 16));
            });
        } else {
            decodedText = encodedString;
        }

        return decodedText;
    }
}