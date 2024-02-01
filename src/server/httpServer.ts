import express, { NextFunction, Request, Response } from 'express';
import http from 'http';

import multer from 'multer';
import path from 'path';

import crypto from 'crypto';
import fs from 'fs';
import { config } from './config';
import { dataCtrl } from './dataCtrl';
import { msgType, socketInfoType } from './dataType';
import { eventSystem } from './eventSystem';
import { getRelativePath } from './getRelativePath';

export class httpServer {
    private static fileHashes: string[];

    private static fileName2HashNameMap: Map<string, string>;
    private static hashName2FileNameMap: Map<string, string>;


    private static app: express.Express;
    private static server: http.Server;
    private static storage: multer.StorageEngine;
    private static upload: multer.Multer;

    private static savePath: string = "";

    static async startHttpServer(port: number) {

        await dataCtrl.getAllFileOrTextHashes().then((hashes) => {
            this.fileHashes = hashes;
            this.fileHashes = this.fileHashes ? this.fileHashes : [];
        });

        await dataCtrl.getFileName2HashNameMap().then((map) => {
            this.fileName2HashNameMap = map;
            this.hashName2FileNameMap = new Map();
            if (this.fileName2HashNameMap) {
                this.fileName2HashNameMap.forEach((value, key) => {
                    this.hashName2FileNameMap.set(value, key);
                });
            }
        });

        await new Promise((resolve, reject) => {
            this.savePath = getRelativePath.tranPath(config.savePath);
            this.checkUploadFileDir();
            this.app = express();
            this.server = http.createServer(this.app);
            this.storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, this.savePath);
                },
                filename: (req, file, cb) => {
                    let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
                }
            });
            this.upload = multer({ storage: this.storage });
            this.addEvent();
            resolve(this.startServer(this.server, port));
        });
    }

    private static async startServer(server: http.Server, port: number) {
        let self = this;
        await new Promise((resolve, reject) => {
            server.listen(port)
                .on('listening', () => {
                    console.log("http服务器已启动：");
                    console.log(`http://${config.URL}:${config.HTTPPORT}`);
                    resolve(null);
                })
                .on('error', (err: any) => {
                    if (err.code === 'EADDRINUSE') {
                        console.warn(`端口${port}已被占用，尝试使用端口${port + 10}`);
                        server.removeAllListeners('listening');
                        config.HTTPPORT = port + 10;
                        resolve(self.startServer(server, port + 10));
                    } else {
                        reject(err);
                        console.error(err);
                    }
                });
        });
    }

    private static checkUploadFileDir() {
        if (!fs.existsSync(this.savePath)) {
            fs.mkdirSync(this.savePath);
        }
    }

    private static addEvent() {
        this.onServerApi();
        eventSystem.on("deleteItem", this.deleteFileOrText.bind(this));
    }

    private static deleteFileOrText(fileOrTextHash: string) {
        if (this.fileHashes) {
            for (let i = 0; i < this.fileHashes.length; i++) {
                if (this.fileHashes[i] === fileOrTextHash) {
                    this.fileHashes.splice(i, 1);
                    break;
                }
            }
        }

        if (this.fileName2HashNameMap) {
            let fileName = this.hashName2FileNameMap.get(fileOrTextHash);
            if (fileName) {
                this.fileName2HashNameMap.delete(fileName);
            }
            this.hashName2FileNameMap.delete(fileOrTextHash);
        }
    }

    private static onServerApi() {
        this.onUploadApi();
        this.onGetSocketInfoApi();
        this.onGetWebFileApi();
        this.onGetUploadFileApi();
    }

    private static onUploadApi() {
        this.app.post('/upload', this.upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
            if (!req.file && !req.body.text) {
                return next(new Error('文件为空'));
            }
            this.onFileUpload(req, res, next);
            this.onTextUpload(req, res, next);
        }, (err: Error, req: Request, res: Response, next: NextFunction) => {
            res.status(500).send(err.message);
        });
    }


    private static onFileUpload(req: Request, res: Response, next: NextFunction) {
        if (req.file) {
            let self = this;
            const hash = crypto.createHash('md5');
            const stream = fs.createReadStream(req.file.path);
            stream.on('data', (data) => hash.update(data));
            stream.on('end', () => {
                const fileHash = hash.digest('hex');
                req.file!.originalname = Buffer.from(req.file!.originalname, "latin1").toString('utf8');
                if (this.fileHashes.indexOf(fileHash) !== -1) {
                    return res.status(409).send('文件已存在' + req.file!.originalname);
                }
                res.send('文件上传成功');
                let savePath = `${config.savePath}/${req.file!.filename}`;
                const msg: msgType = {
                    msgType: "file",
                    fileOrTextHash: fileHash,
                    timestamp: Date.now(),
                    fileName: req.file!.originalname,
                    url: savePath,
                    size: (req.file!.size / 1024) > 0 ? (req.file!.size / 1024) : 0,
                    hashName: req.file!.filename
                };
                dataCtrl.writeToDatabase(msg).then(() => {
                    eventSystem.emit('msgSaved', msg);
                    this.fileHashes.push(fileHash);
                    this.fileName2HashNameMap.set(req.file!.originalname, req.file!.filename);
                    this.hashName2FileNameMap.set(req.file!.filename, req.file!.originalname);
                }).catch((err) => {
                    res.status(500).send(err);
                });
            });
        }
    }

    private static onTextUpload(req: Request, res: Response, next: NextFunction) {
        if (req.body.text) {
            const text = req.body.text;
            const textHash = crypto.createHash('md5').update(text + Date.now() + '-' + Math.round(Math.random() * 1E9)).digest('hex');
            res.send('已发送');
            let msg: msgType = {
                msgType: "text",
                fileOrTextHash: textHash,
                timestamp: Date.now(),
                text: text,
                size: 0,
                hashName: ""
            };
            dataCtrl.writeToDatabase(msg).then(() => {
                eventSystem.emit('msgSaved', msg);
            }).catch((err) => {
                res.status(500).send(err);
            });
        }
    }

    private static onGetSocketInfoApi() {
        this.app.get('/getSocketInfo', (req: Request, res: Response) => {
            const socketInfo: socketInfoType = {
                socketURL: config.URL,
                socketPORT: config.socketPort,
                version: config.version,
            };
            res.send(socketInfo);
        });
    }


    private static onGetWebFileApi() {
        for (let key in config.loadConfig) {
            this.app.get(key, (req: Request, res: Response) => {
                res.sendFile(path.join(__dirname, '../client/' + config.loadConfig[key]));
            });
        }
        this.app.use('/client', express.static(path.join(__dirname, '../client')));
        this.app.get('/client/:file', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../client', req.params.file + '.js'));
        });
    }

    private static onGetUploadFileApi() {
        let self = this;
        this.app.get('/uploadFile/:filename', function (req, res) {
            const file = `${self.savePath}/${req.params.filename}`;
            const fileName = self.hashName2FileNameMap.get(req.params.filename);
            res.download(file, fileName!);
        });
    }
}
