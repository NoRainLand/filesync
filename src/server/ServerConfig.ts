import { MsgData } from "../common/CommonDefine";
import { ServerConfigType } from "./ServerDefine";

export class ServerConfig {
    /**服务器的URL 默认socket和http同一个 */
    static serverIp: string = '127.0.0.1';
    /**http 服务器的端口号 注意，如果端口被占用，会自动加10直到找到空闲端口 */
    static httpPort: number = 4100;
    /**socket 服务器的端口号 注意，如果端口被占用，会自动加10直到找到空闲端口 */
    static socketPort: number = 4200;


    /**上传文件保存路径 */
    static readonly uploadFileSavePath: string = '../uploadFile';
    /**工具路径 */
    static readonly toolPath: string = '../tool';
    /**服务器数据保存路径 */
    static readonly sqlDbPath: string = '../fsDatabase.sqlite';
    /**默认数据表名字 */
    static readonly tableName: string = 'fsTable';

    /**服务器文件映射 */
    static readonly httpFileMap: { [key: string]: string } = {
        "/": "index.html"
    }

    /**服务器配置文件路径 */
    static serverConfigPath = "../serverConfig.json";

    /**服务器配置 */
    static get serverConfig(): ServerConfigType {
        return {
            "ps1": "此处为端口以及IP配置，默认http服务器4100，socket服务器4200",
            "ps2": "如果你要修改，请修改下面的端口号之后重启服务器",
            "ps3": "如果端口冲突，默认+10直到找到空闲端口",
            "ps4": "如果IP获取不对，请修改下面的IP地址",
            "httpPort": this.httpPort,
            "socketPort": this.socketPort,
            "serverIp": this.serverIp
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
