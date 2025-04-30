import { exec } from 'child_process';
import fs from 'fs';
import * as os from 'os';
import path from 'path';

export class Utils {
    private static readonly VIRTUAL_INTERFACE_KEYWORDS = ['Virtual', 'VMware', 'vEthernet'];
    private static readonly DEFAULT_IP = '127.0.0.1';

    /**
     * 获取本机IPv4地址
     * @returns {string} 本机IP地址，如果未找到则返回127.0.0.1
     */
    static getLocalIP(): string {
        const interfaces = os.networkInterfaces();

        for (const [devName, iface] of Object.entries(interfaces)) {
            if (!iface || this.isVirtualInterface(devName)) continue;

            const ipv4Interface = iface.find(alias =>
                alias.family === 'IPv4' &&
                alias.address !== this.DEFAULT_IP &&
                !alias.internal
            );

            if (ipv4Interface) return ipv4Interface.address;
        }

        console.warn("无法获取本机IP地址，将使用默认地址");
        return this.DEFAULT_IP;
    }

    /**
     * 检查目录是否存在，不存在则创建
     * @param {string} dirPath 目录路径
     */
    static checkDirExist(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    /**
     * 获取相对于代码运行的路径
     * @param {string} sourcePath 源路径
     * @param {string} extraPath 额外路径
     * @returns {string} 完整路径
     */
    static getRelativePath(sourcePath: string, extraPath: string = ""): string {
        const base = (<any>process).pkg
            ? path.join(process.cwd(), sourcePath.substring(1))
            : path.join(__dirname, extraPath, sourcePath);
        return path.normalize(base);
    }

    /**
     * 根据操作系统打开默认浏览器
     * @param {string} url 要打开的URL
     */
    static openBrowser(url: string): void {
        const commands = {
            win32: 'start',
            darwin: 'open',
            linux: 'xdg-open'
        } as const;

        const command = commands[process.platform as keyof typeof commands] || commands.linux;
        exec(`${command} ${url}`);
    }

    /**
     * 解码MIME编码的字符串
     * @param {string} encodedString MIME编码的字符串
     * @returns {string} 解码后的字符串
     */
    static decodeMimeEncodedString(encodedString: string): string {
        const mimePattern = /=\?([^?]+)\?([BQ])\?([^?]+)\?=/i;
        const matches = mimePattern.exec(encodedString);

        if (!matches) return encodedString;

        const [, charset, encoding, encodedText] = matches;

        if (encoding.toUpperCase() === 'B') {
            return Buffer.from(encodedText, 'base64').toString(charset as BufferEncoding);
        }

        if (encoding.toUpperCase() === 'Q') {
            return encodedText
                .replace(/_/g, ' ')
                .replace(/=([A-Fa-f0-9]{2})/g, (_, hex) =>
                    String.fromCharCode(parseInt(hex, 16))
                );
        }

        return encodedString;
    }

    private static isVirtualInterface(devName: string): boolean {
        return this.VIRTUAL_INTERFACE_KEYWORDS.some(keyword =>
            devName.includes(keyword)
        );
    }
}