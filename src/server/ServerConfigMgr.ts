import fs from 'fs';
import { ServerConfig } from './ServerConfig';
import { Utils } from './Utils';

interface IServerConfigData {
    httpPort: number;
    socketPort: number;
    serverIp: string;
}

export class ServerConfigMgr {
    private static readonly DEFAULT_ENCODING = 'utf-8';

    /**
     * 读取本地配置
     * @param configPath 配置文件路径
     * @throws Error 当配置文件格式不正确时抛出异常
     */
    static readConfig(configPath: string): void {
        try {
            if (!fs.existsSync(configPath)) {
                console.warn("未找到配置文件，将使用默认配置");
                return;
            }

            const fileContent = fs.readFileSync(configPath, this.DEFAULT_ENCODING);
            const serverConfig = JSON.parse(fileContent) as IServerConfigData;

            this.validateConfig(serverConfig);
            this.updateConfig(serverConfig);

            console.log("配置文件读取成功");
        } catch (error) {
            console.error("读取配置文件失败:", error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    /**
     * 写入本地配置
     * @param configPath 配置文件路径
     * @throws Error 当写入失败时抛出异常
     */
    static writeConfig(configPath: string): void {
        try {
            const configData = JSON.stringify(ServerConfig.serverConfig, null, 2);
            fs.writeFileSync(configPath, configData, this.DEFAULT_ENCODING);
            console.log("配置文件写入成功");
        } catch (error) {
            console.error("写入配置文件失败:", error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    private static validateConfig(config: IServerConfigData): void {
        if (!config.httpPort || !config.socketPort || !config.serverIp) {
            throw new Error("配置文件格式不正确");
        }
    }

    private static updateConfig(config: IServerConfigData): void {
        ServerConfig.httpPort = config.httpPort;
        ServerConfig.socketPort = config.socketPort;
        ServerConfig.serverIp = config.serverIp;
    }
}