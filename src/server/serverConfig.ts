import fs from 'fs';
import { Config } from './Config';
import { GetRelativePath } from './GetRelativePath';
export class ServerConfig {
    private static configPath: string;
    static readConfig(configPath: string) {
        this.configPath = GetRelativePath.tranPath(configPath);
        if (fs.existsSync(this.configPath)) {
            try {
                let serverConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
                Config.HTTPPORT = serverConfig.http_port;
                Config.socketPort = serverConfig.socket_port;
                console.log("配置文件读取成功");
            } catch (e) {
                console.warn(e);
            }
        } else {
            console.warn("未找到配置文件，将使用默认配置");
        }
    }
    static writeConfig(configPath: string) {
        fs.writeFileSync(this.configPath, JSON.stringify(Config.serverConfig, null, 2));
    }
}