import { DatabaseOperation } from './DatabaseOperation';
import { HttpServer } from './HttpServer';
import { ServerConfig } from './ServerConfig';
import { ServerConfigMgr } from './ServerConfigMgr';
import { SocketServer } from './SocketServer';
import { Utils } from './Utils';
/**主入口类 */
export default class index {
    constructor() {
        this.init();
    }
    async init() {
        console.log(ServerConfig.asciiArt);
        console.log('欢迎使用文件服务器...(*￣０￣)ノ');
        ServerConfig.serverIp = Utils.getLocalIP();
        ServerConfigMgr.readConfig(ServerConfig.serverConfigPath);
        await DatabaseOperation.openDatabase(ServerConfig.sqlDbPath, ServerConfig.tableName);
        await SocketServer.startServer(ServerConfig.socketPort);
        await HttpServer.startServer(ServerConfig.httpPort);
        await ServerConfigMgr.writeConfig(ServerConfig.serverConfigPath);
        Utils.openBrowser(`http://${ServerConfig.serverIp}:${ServerConfig.httpPort}`);
    }

}

new index();