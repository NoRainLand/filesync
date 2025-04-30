import { MsgData } from "../common/CommonDefine";
import { ServerConfigType } from "./ServerDefine";
import path from 'path';
import { Utils } from "./Utils";

export class ServerConfig {
    // 基础路径配置
    private static readonly BASE_PATH = path.join(__dirname, '..');

    // 网络配置
    private static readonly DEFAULT_IP = '127.0.0.1';
    private static readonly DEFAULT_HTTP_PORT = 4100;
    private static readonly DEFAULT_SOCKET_PORT = 4200;
    private static readonly PORT_INCREMENT = 10;

    // 服务器配置
    public static serverIp: string = ServerConfig.DEFAULT_IP;
    public static httpPort: number = ServerConfig.DEFAULT_HTTP_PORT;
    public static socketPort: number = ServerConfig.DEFAULT_SOCKET_PORT;
    //以下路径不需要path，因为使用的时候会内部处理
    /**上传文件保存路径 */
    public static readonly uploadFileSavePath: string = Utils.getRelativePath('../uploadFile');
    /**工具路径 */
    public static readonly toolPath: string = Utils.getRelativePath('../tool');
    /**服务器数据保存路径 */
    public static readonly sqlDbPath: string = Utils.getRelativePath('../fsDatabase.sqlite');
    /**服务器数据保存路径 */
    public static readonly serverConfigPath: string = Utils.getRelativePath('../serverConfig.json');

    /**默认数据表名字 */
    public static readonly tableName: string = 'fsTable';

    /**服务器文件映射 */
    public static readonly httpFileMap: Readonly<Record<string, string>> = {
        "/": "index.html"
    } as const;

    public static get serverConfig(): Readonly<ServerConfigType> {
        return {
            ps1: "此处为端口以及IP配置，默认http服务器4100，socket服务器4200",
            ps2: "如果你要修改，请修改下面的端口号之后重启服务器",
            ps3: "如果端口冲突，默认+10直到找到空闲端口",
            ps4: "如果IP获取不对，请修改下面的IP地址",
            httpPort: this.httpPort,
            socketPort: this.socketPort,
            serverIp: this.serverIp
        };
    }

    public static get asciiArt(): string {
        return ServerConfig.ASCII_ART;
    }

    public static get welcomeMsg(): Readonly<MsgData> {
        return {
            msgType: 'text',
            fileOrTextHash: '850f3be40c4b93f7dd0910942d1e5a23',
            timestamp: Date.now(),
            text: '是信息，好耶！<copyright by NoRain>',
            size: 0
        };
    }

    // ASCII艺术字符常量
    private static readonly ASCII_ART = [
        '',
        '          _____                    _____',
        '         /\\    \\                  /\\    \\',
        '        /::\\    \\                /::\\    \\',
        '       /::::\\    \\              /::::\\    \\',
        '      /::::::\\    \\            /::::::\\    \\',
        '     /:::/\\:::\\    \\          /:::/\\:::\\    \\',
        '    /:::/__\\:::\\    \\        /:::/__\\:::\\    \\',
        '   /::::\\   \\:::\\    \\       \\:::\\   \\:::\\    \\',
        '  /::::::\\   \\:::\\    \\    ___\\:::\\   \\:::\\    \\',
        ' /:::/\\:::\\   \\:::\\    \\  /\\   \\:::\\   \\:::\\    \\',
        '/:::/  \\:::\\   \\:::\\____\\/::\\   \\:::\\   \\:::\\____\\',
        '\\::/    \\:::\\   \\::/    /\\:::\\   \\:::\\   \\::/    /',
        ' \\/____/ \\:::\\   \\/____/  \\:::\\   \\:::\\   \\/____/',
        '          \\:::\\    \\       \\:::\\   \\:::\\    \\',
        '           \\:::\\____\\       \\:::\\   \\:::\\____\\',
        '            \\::/    /        \\:::\\  /:::/    /',
        '             \\/____/          \\:::\\/:::/    /',
        '                               \\::::::/    /',
        '                                \\::::/    /',
        '                                 \\::/    /',
        '                                  \\/____/',
        ''
    ].join('\n');
}


