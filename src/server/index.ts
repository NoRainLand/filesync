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
        ServerConfig.serverURL = Utils.getLocalIP();
        ServerConfigMgr.readConfig(ServerConfig.serverConfigPath);
        await DatabaseOperation.openDatabase(ServerConfig.sqlDbPath, ServerConfig.tableName);
        await SocketServer.startServer(ServerConfig.socketPort);
        console.log("http服务器启动中")
        await HttpServer.startServer(ServerConfig.httpPort);
        await ServerConfigMgr.writeConfig(ServerConfig.serverConfigPath);
        Utils.openBrowser(`http://${ServerConfig.serverURL}:${ServerConfig.httpPort}`);
    }

}

new index();