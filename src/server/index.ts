import open from 'open';
import * as os from 'os';
import { Config } from './Config';
import { DbHandler } from './DbHandler';
import { HttpServer } from './HttpServer';
import { ServerConfig } from './ServerConfig';
import { SocketServer } from './SocketServer';
export default class main {

    webUrl: string = '';

    constructor() {
        this.init();
    }

    async init() {
        Config.URL = this.getLocalIP();
        ServerConfig.readConfig(Config.serverConfigPath);
        await DbHandler.openDatabase(Config.dbPath, Config.tableName);
        await SocketServer.startSocketServer(Config.socketPort);
        await HttpServer.startHttpServer(Config.HTTPPORT);
        this.webUrl = `http://${Config.URL}:${Config.HTTPPORT}`;
        await open(this.webUrl);
        await ServerConfig.writeConfig(Config.serverConfigPath);
    }

    getLocalIP() {
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
}

new main();