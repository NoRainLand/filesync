import fs from 'fs';
import path from 'path';
import { config } from './config';
export class serverConfig {
    static async readConfig() {
        let configPath = "";
        if ((<any>process).pkg) {
            configPath = path.join(process.cwd(), config.serverConfigPath);
        } else {
            configPath = path.join(__dirname, "." + config.serverConfigPath);
        }
        if (fs.existsSync(configPath)) {
            let serverConfig = JSON.parse(await fs.readFileSync(configPath, 'utf-8'));
            config.HTTPPORT = serverConfig.http_port;
            config.SocketIOPORT = serverConfig.socket_port;
        }
    }
    static async writeConfig() {
        let configPath = "";
        if ((<any>process).pkg) {
            configPath = path.join(process.cwd(), config.serverConfigPath);
        } else {
            configPath = path.join(__dirname, "." + config.serverConfigPath);
        }
        let dir = path.dirname(configPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        } else {
            await fs.writeFileSync(configPath, JSON.stringify(config.serverConfig, null, 2));
        }
    }
}