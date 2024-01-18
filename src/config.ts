export class config {
    static URL: string = '127.0.0.1'; // 服务器的 URL
    static HTTPPORT: number = 4100; // HTTP 服务器的端口号
    static SocketIOPORT: number = 4200; // Socket.IO 服务器的端口号
    static savePath: string = './uploadFile/'; // 上传文件的保存路径
    static dbPath: string = './myDatabase.sqlite';
    static tableName: string = 'myTable';
    static version: string = "1.3.0"//版本号

    static loadConfig: { [key: string]: string } = {
        "/": "index.html",
        "/favicon.ico": "favicon.ico",
        "/pico.min.css": "pico.min.css",
        "/qrcode.min.js": "qrcode.min.js",
    }
}
