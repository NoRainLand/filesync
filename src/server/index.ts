import open from 'open';
import * as os from 'os';
import { config } from './config';
import { dbHandler } from './dbHandler';
import { httpServer } from './httpServer';
import { serverConfig } from './serverConfig';
import { socketServer } from './socketServer';
export default class main {

    webUrl: string = '';

    constructor() {
        this.init();
    }

    async init() {
        config.URL = this.getLocalIP();
        serverConfig.readConfig(config.serverConfigPath);
        await dbHandler.openDatabase(config.dbPath, config.tableName);
        await socketServer.startSocketServer(config.socketPort);
        await httpServer.startHttpServer(config.HTTPPORT);
        this.webUrl = `http://${config.URL}:${config.HTTPPORT}`;
        await open(this.webUrl);
        await serverConfig.writeConfig(config.serverConfigPath);
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