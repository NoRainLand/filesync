import fs from 'fs';
import { config } from './config';
import { getRelativePath } from './getRelativePath';
export class serverConfig {
    private static configPath: string;
    static readConfig(configPath: string) {
        this.configPath = getRelativePath.tranPath(configPath);
        if (fs.existsSync(this.configPath)) {
            try {
                let serverConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
                config.HTTPPORT = serverConfig.http_port;
                config.socketPort = serverConfig.socket_port;
                console.log("配置文件读取成功");
            } catch (e) {
                console.warn(e);
            }
        } else {
            console.warn("未找到配置文件，将使用默认配置");
        }
    }
    static writeConfig(configPath: string) {
        fs.writeFileSync(this.configPath, JSON.stringify(config.serverConfig, null, 2));
    }
}