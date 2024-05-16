import { MsgData } from "../common/CommonDefine";
import { ServerConfigType } from "./ServerDefine";

export class ServerConfig {
    /**服务器的URL 默认socket和http同一个 */
    static serverURL: string = '127.0.0.1';
    /**http 服务器的端口号 注意，如果端口被占用，会自动加10直到找到空闲端口 */
    static httpPort: number = 4100;
    /**socket 服务器的端口号 注意，如果端口被占用，会自动加10直到找到空闲端口 */
    static socketPort: number = 4200;


    /**上传文件保存路径 */
    static readonly uploadFileSavePath: string = '../uploadFile';
    /**服务器数据保存路径 */
    static readonly sqlDbPath: string = '../fsDatabase.sqlite';
    /**默认数据表名字 */
    static readonly tableName: string = 'fsTable';

    /**服务器文件映射 */
    static readonly httpFileMap: { [key: string]: string } = {
        "/": "index.html",
        "/favicon.ico": "favicon.ico",
        "/css/pico.min.css": "css/pico.min.css",
        "/libs/qrcode.min.js": "libs/qrcode.min.js",
        "/libs/vconsole.min.js": "libs/vconsole.min.js",
        "/libs/clipboard.min.js": "libs/clipboard.min.js"
    }

    /**服务器配置文件路径 */
    static serverConfigPath = "../serverConfig.json";

    /**服务器配置 */
    static get serverConfig(): ServerConfigType {
        return {
            "ps1": "这里主要是端口号，默认http服务器4100，socket服务器4200",
            "ps2": "如果你要修改，请修改下面的端口号之后重启服务器",
            "ps3": "如果端口冲突，默认+10直到找到空闲端口",
            "httpPort": this.httpPort,
            "socketPort": this.socketPort
        };
    }

    /**初次启动服务器欢迎信息 */
    static get welcomeMsg(): MsgData {
        return {
            msgType: 'text',
            fileOrTextHash: '850f3be40c4b93f7dd0910942d1e5a23',
            timestamp: Date.now(),
            text: '是信息，好耶！<copyright by NoRain>',
            size: 0
        }
    }

}
