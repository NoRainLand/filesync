import compression from 'compression';
import crypto from 'crypto';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import http from 'http';
import multer from 'multer';
import path from 'path';
import { ProjectConfig } from '../ProjectConfig';
import { MsgData, ServerInfo } from '../common/CommonDefine';
import { EventMgr } from '../common/EventMgr';
import { DatabaseOperation } from './DatabaseOperation';
import { ServerConfig } from './ServerConfig';
import { EventName } from './ServerDefine';
import { Utils } from './Utils';

export class HttpServer {
    private static fileName2HashNameMap: Map<string, string> = new Map();
    private static hashName2FileNameMap: Map<string, string> = new Map();
    private static hash2FileNameMap: Map<string, string> = new Map();

    private static appExpress: express.Express;
    private static server: http.Server;
    private static storageEngine: multer.StorageEngine;
    private static uploadMulter: multer.Multer;

    private static isRunning: boolean = false;

    /**
     * 开启服务器
     */
    static async startServer(port: number): Promise<void> {
        if (this.isRunning) {
            console.warn('HTTP 服务器已经在运行中');
            return;
        }

        try {
            await this.initializeMaps();
            await this.setupServer(port);
            this.isRunning = true;
        } catch (error) {
            console.error('启动 HTTP 服务器失败:', error);
            throw error;
        }
    }

    /**
     * 停止服务器
     */
    static async stop(): Promise<void> {
        if (!this.isRunning) {
            return;
        }

        return new Promise((resolve, reject) => {
            try {
                this.removeEvent();
                this.server.close((err) => {
                    if (err) {
                        console.error('关闭 HTTP 服务器出错:', err);
                        reject(err);
                        return;
                    }
                    this.isRunning = false;
                    console.log('HTTP 服务器已安全关闭');
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 初始化数据映射
     */
    private static async initializeMaps(): Promise<void> {
        const [fileNameMap, hashMap] = await Promise.all([
            DatabaseOperation.getFileName2HashNameMap(),
            DatabaseOperation.getFileHashAndFileNameMap()
        ]);

        this.fileName2HashNameMap = fileNameMap;
        this.hash2FileNameMap = hashMap;

        // 构建反向映射
        this.hashName2FileNameMap.clear();
        this.fileName2HashNameMap.forEach((value, key) => {
            this.hashName2FileNameMap.set(value, key);
        });
    }

    /**
     * 设置服务器
     */
    private static async setupServer(port: number): Promise<void> {
        Utils.checkDirExist(ServerConfig.uploadFileSavePath);
        this.initializeExpress();
        return this.startHttpServer(port);
    }

    /**
     * 初始化 Express 应用
     */
    private static initializeExpress(): void {
        this.appExpress = express();
        this.appExpress.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
        this.appExpress.use(compression());
        this.server = http.createServer(this.appExpress);

        this.storageEngine = multer.diskStorage({
            destination: (req, file, cb) => cb(null, ServerConfig.uploadFileSavePath),
            filename: (req, file, cb) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
            }
        });

        this.uploadMulter = multer({ storage: this.storageEngine });
    }

    /**
     * 启动 HTTP 服务器
     */
    private static async startHttpServer(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const handleError = (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    const newPort = port + 10;
                    console.warn(`端口 ${port} 已被占用，尝试使用端口 ${newPort}`);
                    this.server.removeAllListeners();
                    ServerConfig.httpPort = newPort;
                    this.startHttpServer(newPort).then(resolve).catch(reject);
                } else {
                    reject(err);
                }
            };

            this.server.listen(port)
                .once('listening', () => {
                    this.addEvent();
                    this.initHttpServerApi();
                    console.log(`HTTP 服务器已启动: http://${ServerConfig.serverIp}:${port}`);
                    resolve();
                })
                .once('error', handleError);
        });
    }



    /**添加监听 */
    private static addEvent() {
        EventMgr.on(EventName.DELETEITEM, this.deleteFileOrText, this);
    }
    /**移除监听 */
    private static removeEvent() {
        EventMgr.off(EventName.DELETEITEM, this.deleteFileOrText, this);
    }

    /**删除文件或文本 */
    private static deleteFileOrText(fileOrTextHash: string) {
        if (this.hash2FileNameMap) {
            this.hash2FileNameMap.delete(fileOrTextHash);
        }

        if (this.fileName2HashNameMap) {
            let fileName = this.hashName2FileNameMap.get(fileOrTextHash);
            if (fileName) {
                this.fileName2HashNameMap.delete(fileName);
            }
            this.hashName2FileNameMap.delete(fileOrTextHash);
        }
    }

    /**初始化http服务器api */
    private static initHttpServerApi() {
        this.initUploadApi();
        this.initGetSocketInfoApi();
        this.initGetWebFileApi();
        this.initGetUploadFileApi();
        this.initGetToolApi();
    }

    /**初始化上传api */
    private static initUploadApi() {
        this.appExpress.post('/upload', this.uploadMulter.single('file'), (req: Request, res: Response, next: NextFunction) => {
            if (!req.file && !req.body.text) {
                return next(new Error('文件为空'));
            }
            this.onFileUpload(req, res, next);
            this.onTextUpload(req, res, next);
        }, (err: Error, req: Request, res: Response, next: NextFunction) => {
            res.status(500).send(err.message);
        });
    }

    /**文件上传 */
    private static onFileUpload(req: Request, res: Response, next: NextFunction) {
        if (req.file) {
            let self = this;
            const hash = crypto.createHash('md5');
            const stream = fs.createReadStream(req.file.path);
            stream.on('data', (data) => hash.update(data));
            stream.on('end', () => {
                const fileHash = hash.digest('hex');
                req.file!.originalname = Buffer.from(req.file!.originalname, "latin1").toString('utf8');
                if (this.hash2FileNameMap.get(fileHash)) {
                    let name = self.hash2FileNameMap.get(fileHash);
                    if (!res.headersSent) {
                        return res.status(409).send('文件已存在：' + name);
                    }
                }
                let savePath = `${ServerConfig.uploadFileDbPath}/${req.file!.filename}`;
                const msg: MsgData = {
                    msgType: "file",
                    fileOrTextHash: fileHash,
                    timestamp: Date.now(),
                    fileName: Utils.decodeMimeEncodedString(req.file!.originalname),
                    url: savePath,
                    size: (req.file!.size / 1024) > 0 ? (req.file!.size / 1024) : 0,
                    hashName: req.file!.filename
                };
                DatabaseOperation.writeToDatabase(msg).then(() => {
                    if (!res.headersSent) {
                        res.send('文件上传成功');
                    }
                    EventMgr.emit(EventName.ONMESSAGESAVED, msg);
                    this.hash2FileNameMap.set(fileHash, req.file!.originalname);
                    this.fileName2HashNameMap.set(req.file!.originalname, req.file!.filename);
                    this.hashName2FileNameMap.set(req.file!.filename, req.file!.originalname);
                }).catch((err) => {
                    console.error(err);
                    if (!res.headersSent) {
                        res.status(500).send("数据库写入失败");
                    }
                });
            });
        }
    }


    /**文本上传 */
    private static onTextUpload(req: Request, res: Response, next: NextFunction) {
        if (req.body.text) {
            const text = req.body.text;
            const textHash = crypto.createHash('md5').update(text + Date.now() + '-' + Math.round(Math.random() * 1E9)).digest('hex');
            let msg: MsgData = {
                msgType: "text",
                fileOrTextHash: textHash,
                timestamp: Date.now(),
                text: text,
                size: 0,
                hashName: ""
            };
            DatabaseOperation.writeToDatabase(msg).then(() => {
                EventMgr.emit(EventName.ONMESSAGESAVED, msg);
                if (!res.headersSent) {
                    res.send('已发送');
                }
            }).catch((err) => {
                console.error(err);
                if (!res.headersSent) {
                    res.status(500).send("数据库写入失败");
                }
            });
        }
    }

    /**获取socket服务器信息 */
    private static initGetSocketInfoApi() {
        this.appExpress.get('/getSocketInfo', (req: Request, res: Response) => {
            const socketInfo: ServerInfo = {
                socketServerURL: ServerConfig.serverIp,
                socketPort: ServerConfig.socketPort,
                projectName: ProjectConfig.projectName,
                author: ProjectConfig.author,
                description: ProjectConfig.description,
                version: ProjectConfig.versionStr,
            };
            res.send(socketInfo);
        });
    }

    /**获取web文件 */
    private static initGetWebFileApi() {
        for (let key in ServerConfig.httpFileMap) {
            this.appExpress.get(key, (req: Request, res: Response) => {
                const filePath = path.join(__dirname, '../client/' + ServerConfig.httpFileMap[key]);
                res.sendFile(filePath, (err) => {
                    if (err) {
                        let msg = `File not found1: ${ServerConfig.httpFileMap[key]}`;
                        console.log(msg);
                        if (!res.headersSent) {
                            res.status(404).send(msg);
                        }
                    }
                });
            });
        }

        //根目录文件
        this.appExpress.get('/:file', (req: Request, res: Response) => {
            const filePath = path.join(__dirname, '../client/', req.params.file);
            res.sendFile(filePath, (err) => {
                if (err) {
                    let msg = `File not found: ${req.params.file}`;
                    console.log(msg);
                    if (!res.headersSent) {
                        res.status(404).send(msg);
                    }
                }
            });
        });

        //第三方库文件
        this.appExpress.get('/libs/:file', (req: Request, res: Response) => {
            const filePath = path.join(__dirname, '../client/libs/', req.params.file);
            res.sendFile(filePath, (err) => {
                if (err) {
                    let msg = `File not found: ${req.params.file}`;
                    console.log(msg);
                    if (!res.headersSent) {
                        res.status(404).send(msg);
                    }
                }
            });
        });

    }

    /**获取上传文件 */
    private static initGetUploadFileApi() {
        let self = this;
        this.appExpress.get('/uploadFile/:filename', (req, res) => {
            const filePath = `${ServerConfig.uploadFileSavePath}/${req.params.filename}`;
            const fileName = self.hashName2FileNameMap.get(req.params.filename);
            console.warn(fileName);
            console.warn(filePath);
            res.download(filePath, fileName!, (err) => {
                if (err) {
                    console.error(err);
                    if (!res.headersSent) {
                        res.status(500).send("文件下载失败");
                    }
                }
            });
        });
    }

    /**获取桌面快捷工具 */
    private static initGetToolApi() {
        let self = this;
        this.appExpress.get('/tool/:filename', (req, res) => {
            const file = `${ServerConfig.toolPath}/${req.params.filename}`;
            res.download(file, req.params.filename!, (err) => {
                if (err) {
                    console.error(err);
                    if (!res.headersSent) {
                        res.status(500).send("工具下载失败");
                    }
                }
            });
        });
    }
}
