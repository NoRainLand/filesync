import { configType } from "./dataType";

export class config {
    static URL: string = '127.0.0.1'; // 服务器的 URL
    static HTTPPORT: number = 4100; // HTTP 服务器的端口号 注意，如果端口被占用，会自动加10直到找到空闲端口
    static SocketIOPORT: number = 4200; // Socket.IO 服务器的端口号 注意，如果端口被占用，会自动加10直到找到空闲端口
    static savePath: string = './uploadFile/'; // 上传文件的保存路径
    static dbPath: string = './myDatabase.sqlite';
    static tableName: string = 'myTable';
    static version: string = "1.7.0"//版本号

    static loadConfig: { [key: string]: string } = {
        "/": "index.html",
        "/favicon.ico": "favicon.ico",
        "/pico.min.css": "pico.min.css",
        "/qrcode.min.js": "qrcode.min.js",
        "/vconsole.min.js": "vconsole.min.js"
    }

    static serverConfigPath = "./serverConfig.json";

    static get serverConfig(): configType {
        return {
            "ps1": "这里主要是端口号，默认http服务器4100，socket服务器4200",
            "ps2": "如果你要修改，请修改下面的端口号之后重启服务器",
            "http_port": config.HTTPPORT,
            "socket_port": config.SocketIOPORT
        };
    }

    static wellcomeMsg = {
        msgType: 'text',
        fileOrTextHash: '850f3be40c4b93f7dd0910942d1e5a23',
        timestamp: 1706526142353,
        text: '是信息，好耶！<copyright by NoRain>',
        size: 0
    }

}
