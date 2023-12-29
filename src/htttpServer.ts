import express, { NextFunction, Request, Response } from 'express';
import http from 'http';

import multer from 'multer';
import path from 'path';

import crypto from 'crypto';
import fs from 'fs';
import { config } from './config';
import { dataCtrl } from './dataCtrl';
import { msgType } from './dataType';
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

        app.get('/', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, 'es6/index.html'));
        });

        app.get('/favicon.ico', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, 'es6/favicon.ico'));
        });

        app.get('/getSocketInfo', (req: Request, res: Response) => {
            res.send({
                socketURL: config.URL,
                socketPORT: config.SocketIOPORT
            });
        });

        app.use('/es6', express.static(path.join(__dirname, 'es6')));

        app.get('/es6/:file', function (req, res) {
            res.sendFile(path.join(__dirname, 'es6', req.params.file + '.js'));
        });

        app.use('/uploadFile', express.static(path.join(__dirname, '../uploadFile')));

        server.listen(port, () => { // 使用变量
            console.log(`HttpServer is running on http://${config.URL}:${port}`);
        });
    }

    static checkDir() {
        if (!fs.existsSync(config.savePath)) {
            fs.mkdirSync(config.savePath);
        }
    }
}
