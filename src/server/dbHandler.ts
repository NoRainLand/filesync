import fs from 'fs';
import sqlite3 from 'sqlite3';
import { Config } from './Config';
import { msgType } from './DataType';
import { GetRelativePath } from './GetRelativePath';

export class DbHandler {
    private static db: sqlite3.Database;
    private static tableName: string = "";

    private static dbIsOpen: boolean = false;

    private static dbExists: boolean = false;

    private static dbPath: string;


    static async openDatabase(dbPath: string, tableName: string) {
        if (this.dbIsOpen) return Promise.resolve();
        this.dbPath = GetRelativePath.tranPath(dbPath);
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

    private static async createTable() {
        let self = this;
        await new Promise((resolve, reject) => {
            self.db.run(self.getSqlCommand("createTable"), (err) => {
                if (err) {
                    self.db.close();
                    reject(err);
                } else {
                    self.dbIsOpen = true;
                    if (!self.dbExists) {
                        resolve(self.writeToDatabase((Config.wellcomeMsg as any)));
                    } else {
                        console.log(`数据库 ${this.dbPath} 已开启`);
                        resolve(null);
                    }
                }
            });
        });
    }


    static writeToDatabase(msg: msgType): Promise<void> {
        if (!this.dbIsOpen) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const { fileName, fileOrTextHash, timestamp, text, msgType, url, size, hashName: originalname } = msg;
            this.db.run(this.getSqlCommand("writeToDatabase"), [fileName, fileOrTextHash, timestamp, text, msgType, url, size, originalname], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }

    static deleteFromDatabase(hash: string): Promise<void> {
        if (!this.dbIsOpen) return Promise.resolve();
        return new Promise((resolve, reject) => {
            this.db.run(this.getSqlCommand("deleteFromDatabase"), hash, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }

    static getAllMsgs(): Promise<msgType[]> {
        if (!this.dbIsOpen) return Promise.resolve([]);
        return new Promise((resolve, reject) => {
            this.db.all(this.getSqlCommand("getAllMsgs"), (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows as msgType[]);
                }
            });
        });
    }

    static getAllFileOrTextHashes(): Promise<string[]> {
        if (!this.dbIsOpen) return Promise.resolve([]);
        return new Promise((resolve, reject) => {
            this.db.all(this.getSqlCommand("getAllFileOrTextHashes"), [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const hashes = rows.map((row: any) => row.fileOrTextHash);
                    resolve(hashes);
                }
            });
        });
    }

    static getMsgTypeByHash(hash: string): Promise<msgType> {//Function.prototype.name实际编译压缩后可能会变
        if (!this.dbIsOpen) return Promise.resolve({} as msgType);
        return new Promise((resolve, reject) => {
            this.db.get(this.getSqlCommand("getMsgTypeByHash"), hash, (err: any, row: msgType) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }


    static getFileName2HashNameMap(): Promise<Map<string, string>> {
        if (!this.dbIsOpen) return Promise.resolve(new Map<string, string>());
        return new Promise((resolve, reject) => {
            this.db.all(this.getSqlCommand("getFileName2HashNameMap"), (err: any, rows: Array<{ fileName: string, originalname: string }>) => {
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

    private static getSqlCommand(cammand: string, tableName?: string): string {
        tableName = tableName ? tableName : this.tableName;
        switch (cammand) {
            case "createTable":
                return `CREATE TABLE IF NOT EXISTS ${tableName} (fileName TEXT, fileOrTextHash TEXT, timestamp INTEGER, text TEXT, msgType TEXT,url TEXT,size INTEGER,originalname TEXT)`;
            case "writeToDatabase":
                return `INSERT INTO ${tableName} (fileName, fileOrTextHash, timestamp, text, msgType, url ,size,originalname) VALUES (?, ?, ?, ?, ? ,? ,?,?)`;
            case "deleteFromDatabase":
                return `DELETE FROM ${tableName} WHERE fileOrTextHash = ?`;
            case "getAllMsgs":
                return `SELECT * FROM ${tableName}`;
            case "getAllFileOrTextHashes":
                return `SELECT fileOrTextHash FROM ${tableName}`;
            case "getMsgTypeByHash":
                return `SELECT * FROM ${tableName} WHERE fileOrTextHash = ?`;
            case "getFileName2HashNameMap":
                return `SELECT fileName, originalname FROM ${tableName} WHERE msgType = 'file'`;
            default:
                return "";
        }
    }
}