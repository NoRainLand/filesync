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

export class httpServer {
    static deleteFileOrText(fileOrTextHash: string) {
        if (this.fileHashes) {
            for (let i = 0; i < this.fileHashes.length; i++) {
                if (this.fileHashes[i] === fileOrTextHash) {
                    this.fileHashes.splice(i, 1);
                    break;
                }
            }
        }
    }

    private static fileHashes: string[] = [];

    static startHttpServer(port: number) {
        this.checkDir();
        eventSystem.on("deleteItem", this.deleteFileOrText.bind(this));
        const app = express();
        const server = http.createServer(app);
        // 设置 multer
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, config.savePath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
            }
        });

        const upload = multer({ storage: storage });

        // 保存文件的 MD5 哈希值
        dataCtrl.getAllFileOrTextHashes().then((hashes) => {
            this.fileHashes = hashes;
            this.fileHashes = this.fileHashes ? this.fileHashes : [];
        });

        app.post('/upload', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
            if (!req.file && !req.body.text) {
                return next(new Error('文件为空'));
            }
            if (req.file) {
                // 计算文件的 MD5 哈希值
                const hash = crypto.createHash('md5');
                const stream = fs.createReadStream(req.file.path);
                stream.on('data', (data) => hash.update(data));
                stream.on('end', () => {
                    console.log('req.file.path', req.file!.path);
                    const fileHash = hash.digest('hex');
                    req.file!.originalname = Buffer.from(req.file!.originalname, "latin1").toString('utf8');
                    if (this.fileHashes.indexOf(fileHash) !== -1) {
                        return res.status(409).send('文件已存在' + req.file!.originalname);
                    }
                    this.fileHashes.push(fileHash);
                    res.send('文件上传成功');
                    let msg: msgType = {
                        msgType: "file",
                        fileOrTextHash: fileHash,
                        timestamp: Date.now(),
                        fileName: req.file!.originalname,
                        url: `${config.savePath.replace(".", "")}${req.file!.filename}`,
                        size: (req.file!.size / 1024) > 0 ? (req.file!.size / 1024) : 0,
                    };
                    dataCtrl.saveMsg(msg);
                });
            }
            if (req.body.text) {
                // 处理文本上传
                const text = req.body.text;
                const textHash = crypto.createHash('md5').update(text + Date.now() + '-' + Math.round(Math.random() * 1E9)).digest('hex');
                // if (fileHashes.has(textHash)) {
                //     return res.status(409).send('Text already uploaded: ' + text.substring(0, 20));
                // }
                // fileHashes.set(textHash, text);
                res.send('已发送');
                let msg: msgType = {
                    msgType: "text",
                    fileOrTextHash: textHash,
                    timestamp: Date.now(),
                    text: text
                };
                dataCtrl.saveMsg(msg);
            }
        }, (err: Error, req: Request, res: Response, next: NextFunction) => {
            // Handle the error
            res.status(500).send(err.message);
        });

        for (let key in config.loadConfig) {
            app.get(key, (req: Request, res: Response) => {
                res.sendFile(path.join(__dirname, 'es6/' + config.loadConfig[key]));
            });
        }


        app.get('/getSocketInfo', (req: Request, res: Response) => {
            let socketInfo: socketInfoType = {
                socketURL: config.URL,
                socketPORT: config.SocketIOPORT,
                version: config.version,
            };
            res.send(socketInfo);
        });

        app.use('/es6', express.static(path.join(__dirname, 'es6')));

        app.get('/es6/:file', function (req, res) {
            res.sendFile(path.join(__dirname, 'es6', req.params.file + '.js'));
        });

        let filePath = "";
        if ((<any>process).pkg) {
            // 如果在 pkg 打包的可执行文件中运行
            filePath = path.join(process.cwd(), config.savePath);
        } else {
            // 如果在 Node.js 环境中运行
            filePath = path.join(__dirname, "." + config.savePath);
        }
        app.use('/uploadFile', express.static(filePath));

        let onListening = () => {
            console.log("http服务器已启动：");
            console.log(`http://${config.URL}:${config.HTTPPORT}`);
        };

        let startServer = (server: any, port: number) => {
            server.listen(port).on('listening', onListening).on('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`端口${port}已被占用，尝试使用端口${port + 10}`);
                    server.removeListener('listening', onListening);
                    config.HTTPPORT = port + 10;
                    startServer(server, port + 10);
                } else {
                    console.log(err);
                }
            });
        }
        startServer(server, port);
    }

    static checkDir() {
        if (!fs.existsSync(config.savePath)) {
            fs.mkdirSync(config.savePath);
        }
    }
}
