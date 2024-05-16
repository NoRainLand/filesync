import fs from 'fs';
import { ServerConfig } from './ServerConfig';
import { Utils } from './Utils';
export class ServerConfigMgr {
    /**读取本地配置 */
    static readConfig(configPath: string) {
        configPath = Utils.getRelativePath(configPath);
        if (fs.existsSync(configPath)) {
            try {
                let serverConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                ServerConfig.httpPort = serverConfig.httpPort;
                ServerConfig.socketPort = serverConfig.httpPort;
                console.log("配置文件读取成功");
            } catch (e) {
                console.warn(e);
            }
        } else {
            console.warn("未找到配置文件，将使用默认配置");
        }
    }
    /**写入本地配置 */
    static writeConfig(configPath: string) {
        configPath = Utils.getRelativePath(configPath);
        fs.writeFileSync(configPath, JSON.stringify(ServerConfig.serverConfig, null, 2));
    }
}