import fs from 'fs';
import sqlite3 from 'sqlite3';
import { MsgData } from '../common/CommonDefine';
import { ServerConfig } from './ServerConfig';
import { SQLCAMMAND } from './ServerDefine';
import { Utils } from './Utils';

/**数据库操作类 */
export class DatabaseOperation {
    private static db: sqlite3.Database;
    private static tableName: string = "";

    private static dbIsOpen: boolean = false;

    private static dbExists: boolean = false;

    private static dbPath: string;

    /**开启数据库 */
    static async openDatabase(dbPath: string, tableName: string) {
        if (this.dbIsOpen) return Promise.resolve();
        this.dbPath = Utils.getRelativePath(dbPath);
        this.dbExists = fs.existsSync(this.dbPath);
        await new Promise((resolve, reject) => {
            this.tableName = tableName;
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.createTable());
                }
            });
        });
    }

    /**创建数据库表 */
    private static async createTable() {
        let self = this;
        await new Promise((resolve, reject) => {
            self.db.run(self.getSqlCommand(SQLCAMMAND.CREATETABLE), (err) => {
                if (err) {
                    self.db.close();
                    reject(err);
                } else {
                    self.dbIsOpen = true;
                    if (!self.dbExists) {
                        resolve(self.writeToDatabase(ServerConfig.welcomeMsg));
                    } else {
                        console.log("数据库已开启：");
                        console.log(this.dbPath);
                        resolve(null);
                    }
                }
            });
        });
    }

    /**写入数据库 */
    static writeToDatabase(msg: MsgData): Promise<void> {
        if (!this.dbIsOpen) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const { fileName, fileOrTextHash, timestamp, text, msgType, url, size, hashName: originalname } = msg;
            this.db.run(this.getSqlCommand(SQLCAMMAND.WRITETODATABASE), [fileName, fileOrTextHash, timestamp, text, msgType, url, size, originalname], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }

    /**从数据库删除 */
    static deleteFromDatabase(hash: string): Promise<void> {
        if (!this.dbIsOpen) return Promise.resolve();
        return new Promise((resolve, reject) => {
            this.db.run(this.getSqlCommand(SQLCAMMAND.DELETEFROMDATABASE), hash, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }

    /**获取所有消息 */
    static getAllMsgs(): Promise<MsgData[]> {
        if (!this.dbIsOpen) return Promise.resolve([]);
        return new Promise((resolve, reject) => {
            this.db.all(this.getSqlCommand(SQLCAMMAND.GETALLMSGS), (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows as MsgData[]);
                }
            });
        });
    }

    /**获取所有文件或文本的hash */
    static getAllFileOrTextHashes(): Promise<string[]> {
        if (!this.dbIsOpen) return Promise.resolve([]);
        return new Promise((resolve, reject) => {
            this.db.all(this.getSqlCommand(SQLCAMMAND.GETALLFILEORTEXTHASHES), [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const hashes = rows.map((row: any) => row.fileOrTextHash);
                    resolve(hashes);
                }
            });
        });
    }

    /**获取所有文件的的hash和文件源码的map */
    static getFileHashAndFileNameMap(): Promise<Map<string, string>> {
        if (!this.dbIsOpen) return Promise.resolve(new Map<string, string>());
        return new Promise((resolve, reject) => {
            this.db.all(this.getSqlCommand(SQLCAMMAND.GETALLFILEHASHES), [], (err, rows: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    const map = new Map<string, string>();
                    for (const row of rows) {
                        map.set(row.fileOrTextHash, row.fileName);
                    }
                    resolve(map);
                }
            });
        });
    }

    /**根据hash获取消息 */
    static getMsgDataByHash(hash: string): Promise<MsgData> {//Function.prototype.name实际编译压缩后可能会变
        if (!this.dbIsOpen) return Promise.resolve({} as MsgData);
        return new Promise((resolve, reject) => {
            this.db.get(this.getSqlCommand(SQLCAMMAND.GETMSGTYPEBYHASH), hash, (err: any, row: MsgData) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    /**获取文件名到hash名的映射 */
    static getFileName2HashNameMap(): Promise<Map<string, string>> {
        if (!this.dbIsOpen) return Promise.resolve(new Map<string, string>());
        return new Promise((resolve, reject) => {
            this.db.all(this.getSqlCommand(SQLCAMMAND.GETFILENAME2HASHNAMEMAP), (err: any, rows: Array<{ fileName: string, originalname: string }>) => {
                if (err) {
                    reject(err);
                } else {
                    const map = new Map<string, string>();
                    for (const row of rows) {
                        map.set(row.fileName, row.originalname);
                    }
                    resolve(map);
                }
            });
        });
    }

    /**获取sql语句 */
    private static getSqlCommand(cammand: SQLCAMMAND, tableName?: string): string {
        tableName = tableName ? tableName : this.tableName;
        switch (cammand) {
            case SQLCAMMAND.CREATETABLE:
                return `CREATE TABLE IF NOT EXISTS ${tableName} (fileName TEXT, fileOrTextHash TEXT, timestamp INTEGER, text TEXT, msgType TEXT,url TEXT,size INTEGER,originalname TEXT)`;
            case SQLCAMMAND.WRITETODATABASE:
                return `INSERT INTO ${tableName} (fileName, fileOrTextHash, timestamp, text, msgType, url ,size,originalname) VALUES (?, ?, ?, ?, ? ,? ,?,?)`;
            case SQLCAMMAND.DELETEFROMDATABASE:
                return `DELETE FROM ${tableName} WHERE fileOrTextHash = ?`;
            case SQLCAMMAND.GETALLMSGS:
                return `SELECT * FROM ${tableName}`;
            case SQLCAMMAND.GETALLFILEORTEXTHASHES:
                return `SELECT fileOrTextHash FROM ${tableName}`;
            case SQLCAMMAND.GETMSGTYPEBYHASH:
                return `SELECT * FROM ${tableName} WHERE fileOrTextHash = ?`;
            case SQLCAMMAND.GETFILENAME2HASHNAMEMAP:
                return `SELECT fileName, originalname FROM ${tableName} WHERE msgType = 'file'`;
            case SQLCAMMAND.GETALLFILEHASHES:
                return `SELECT * FROM ${tableName} WHERE msgType = 'file'`;
            default:
                return "";
        }
    }
}