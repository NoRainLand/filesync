import { DatabaseOperation } from './DatabaseOperation';
import { HttpServer } from './HttpServer';
import { ServerConfig } from './ServerConfig';
import { ServerConfigMgr } from './ServerConfigMgr';
import { SocketServer } from './SocketServer';
import { Utils } from './Utils';

/**
 * 文件服务器主入口类
 */
export class FileServer {
    private static instance: FileServer;

    private constructor() { }

    /**
     * 获取单例实例
     */
    public static getInstance(): FileServer {
        if (!FileServer.instance) {
            FileServer.instance = new FileServer();
        }
        return FileServer.instance;
    }

    /**
     * 初始化服务器
     */
    public async start(): Promise<void> {
        try {
            console.log(ServerConfig.asciiArt);
            console.log('欢迎使用文件服务器...(*￣０￣)ノ');

            // 初始化基础配置
            ServerConfig.serverIp = Utils.getLocalIP();
            await ServerConfigMgr.readConfig(ServerConfig.serverConfigPath);

            // 启动核心服务
            await this.initializeServices();

            // 保存配置并打开浏览器
            await ServerConfigMgr.writeConfig(ServerConfig.serverConfigPath);
            Utils.openBrowser(`http://${ServerConfig.serverIp}:${ServerConfig.httpPort}`);

            // 注册进程退出处理
            this.registerProcessHandlers();
        } catch (error) {
            console.error('服务器启动失败:', error);
            process.exit(1);
        }
    }

    /**
     * 初始化核心服务
     */
    private async initializeServices(): Promise<void> {
        try {
            await DatabaseOperation.openDatabase(ServerConfig.sqlDbPath, ServerConfig.tableName);
            await SocketServer.startServer(ServerConfig.socketPort);
            await HttpServer.startServer(ServerConfig.httpPort);
        } catch (error) {
            throw new Error(`核心服务初始化失败: ${error}`);
        }
    }

    /**
     * 注册进程退出处理程序
     */
    private registerProcessHandlers(): void {
        process.on('SIGINT', this.gracefulShutdown.bind(this));
        process.on('SIGTERM', this.gracefulShutdown.bind(this));
        process.on('uncaughtException', (error) => {
            console.error('未捕获的异常:', error);
            this.gracefulShutdown();
        });
    }

    /**
     * 优雅退出
     */
    private async gracefulShutdown(): Promise<void> {
        console.log('\n正在关闭服务器...');
        try {
            await HttpServer.stop();
            await SocketServer.stop();
            await DatabaseOperation.closeDatabase();
            console.log('服务器已安全关闭');
        } catch (error) {
            console.error('服务器关闭过程中出现错误:', error);
        } finally {
            process.exit(0);
        }
    }
}

// 启动服务器
FileServer.getInstance().start();