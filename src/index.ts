import open from 'open';
import * as os from 'os';
import { config } from './config';
import { dataHandler } from './dataHandler';
import { httpServer } from './htttpServer';
import { serverConfig } from './serverConfig';
import { socketServer } from './socketServer';
export default class main {
    constructor() {
        this.init();
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
        return '';
    }
    async init() {
        config.URL = this.getLocalIP();
        await serverConfig.readConfig();
        await dataHandler.openDatabase(config.dbPath, config.tableName);
        await socketServer.startSocketServer(config.SocketIOPORT);
        await httpServer.startHttpServer(config.HTTPPORT);
        let url = `http://${config.URL}:${config.HTTPPORT}`;
        await open(url);
        await serverConfig.writeConfig();
    }
}

new main();