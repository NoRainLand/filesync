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

    private static fileName2HashNameMap: Map<string, string>;
    private static hashName2FileNameMap: Map<string, string>;

    private static hash2FileNameMap: Map<string, string>;


    private static appExpress: express.Express;
    private static server: http.Server;
    private static storageEngine: multer.StorageEngine;
    private static uploadMulter: multer.Multer;

    private static savePath: string = "";
    private static toolPath: string = "";

    /**开启服务器 */
    static async startServer(port: number) {
        await DatabaseOperation.getFileName2HashNameMap().then((map) => {
            this.fileName2HashNameMap = map;
            this.hashName2FileNameMap = new Map();
            if (this.fileName2HashNameMap) {
                this.fileName2HashNameMap.forEach((value, key) => {//转换map，读写加快
                    this.hashName2FileNameMap.set(value, key);
                });
            }
        });

        await DatabaseOperation.getFileHashAndFileNameMap().then((map) => {
            this.hash2FileNameMap = map;
        });

        await new Promise((resolve, reject) => {
            this.savePath = Utils.getRelativePath(ServerConfig.uploadFileSavePath);
            this.toolPath = Utils.getRelativePath(ServerConfig.toolPath);
            this.initServer();
            resolve(this.startHttpServer(this.server, port));
        });
    }

    /**初始化服务器框架 */
    private static initServer() {
        Utils.checkDirExist(this.savePath);
        this.appExpress = express();
        this.appExpress.use(compression());//开启gzip压缩
        this.server = http.createServer(this.appExpress);
        this.storageEngine = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.savePath);
            },
            filename: (req, file, cb) => {
                let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
            }
        });
        this.uploadMulter = multer({ storage: this.storageEngine });
    }

    /**开启http服务器 */
    private static async startHttpServer(server: http.Server, port: number) {
        await new Promise((resolve, reject) => {
            server.listen(port)
                .on('listening', () => {
                    this.addEvent();
                    this.initHttpServerApi();
                    console.log("http服务器已启动：");
                    console.log(`http://${ServerConfig.serverURL}:${ServerConfig.httpPort}`);
                    resolve(null);
                })
                .on('error', (err: any) => {
                    if (err.code === 'EADDRINUSE') {
                        console.warn(`http服务器请求的端口${port}已被占用，尝试使用端口${port + 10}`);
                        server.removeAllListeners('listening');
                        server.removeAllListeners('error');
                        ServerConfig.httpPort = port + 10;
                        resolve(this.startHttpServer(server, port + 10));
                    } else {
                        reject(err);
                        console.error(err);
                    }
                });
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
                    return res.status(409).send('文件已存在：' + name);
                }
                res.send('文件上传成功');
                let savePath = `${ServerConfig.uploadFileSavePath}/${req.file!.filename}`;
                const msg: MsgData = {
                    msgType: "file",
                    fileOrTextHash: fileHash,
                    timestamp: Date.now(),
                    fileName: req.file!.originalname,
                    url: savePath,
                    size: (req.file!.size / 1024) > 0 ? (req.file!.size / 1024) : 0,
                    hashName: req.file!.filename
                };
                DatabaseOperation.writeToDatabase(msg).then(() => {
                    EventMgr.emit(EventName.ONMESSAGESAVED, msg);
                    this.hash2FileNameMap.set(fileHash, req.file!.originalname);
                    this.fileName2HashNameMap.set(req.file!.originalname, req.file!.filename);
                    this.hashName2FileNameMap.set(req.file!.filename, req.file!.originalname);
                }).catch((err) => {
                    console.error(err);
                    res.status(500).send("数据库写入失败");
                });
            });
        }
    }

    /**文本上传 */
    private static onTextUpload(req: Request, res: Response, next: NextFunction) {
        if (req.body.text) {
            const text = req.body.text;
            const textHash = crypto.createHash('md5').update(text + Date.now() + '-' + Math.round(Math.random() * 1E9)).digest('hex');
            res.send('已发送');
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
            }).catch((err) => {
                console.error(err);
                res.status(500).send("数据库写入失败");
            });
        }
    }

    /**获取socket服务器信息 */
    private static initGetSocketInfoApi() {
        this.appExpress.get('/getSocketInfo', (req: Request, res: Response) => {
            const socketInfo: ServerInfo = {
                socketServerURL: ServerConfig.serverURL,
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
                res.sendFile(path.join(__dirname, '../client/' + ServerConfig.httpFileMap[key]));
            });
        }

        this.appExpress.get('/:file', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../client/', req.params.file));
        });
    }

    /**获取上传文件 */
    private static initGetUploadFileApi() {
        let self = this;
        this.appExpress.get('/uploadFile/:filename', (req, res) => {
            const file = `${self.savePath}/${req.params.filename}`;
            const fileName = self.hashName2FileNameMap.get(req.params.filename);
            res.download(file, fileName!);
        });
    }

    /**获取桌面快捷工具 */
    private static initGetToolApi() {
        let self = this;
        this.appExpress.get('/tool/:filename', (req, res) => {

            res.download(path.join(__dirname, '../tool/' + req.params.filename), req.params.filename!);
        });
    }
}
