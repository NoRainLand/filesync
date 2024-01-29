import fs from 'fs';
import sqlite3 from 'sqlite3';
import { config } from './config';
import { msgType } from './dataType';

export class dataHandler {
    private static db: sqlite3.Database;
    private static tableName: string;

    static async openDatabase(dbPath: string, tableName: string) {
        const dbExists = fs.existsSync(dbPath);
        this.tableName = tableName;
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log(`Database ${dbPath} opened`);
            this.db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (fileName TEXT, fileOrTextHash TEXT, timestamp INTEGER, text TEXT, msgType TEXT,url TEXT,size INTEGER)`, (err) => {
                if (err) {
                    console.error(err.message);
                }
                if (!dbExists) {
                    this.writeToDatabase((config.wellcomeMsg as any));
                }
            });
        });
    }

    // 保存消息
    static async saveMsg(msg: msgType) {
        await this.writeToDatabase(msg);
    }

    static async writeToDatabase(msg: msgType) {
        const { fileName, fileOrTextHash, timestamp, text, msgType, url, size } = msg;
        this.db.run(`INSERT INTO ${this.tableName} (fileName, fileOrTextHash, timestamp, text, msgType, url ,size) VALUES (?, ?, ?, ?, ? ,? ,?)`, [fileName, fileOrTextHash, timestamp, text, msgType, url, size], (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }

    static async deleteFromDatabase(hash: string) {
        this.db.run(`DELETE FROM ${this.tableName} WHERE fileOrTextHash = ?`, hash, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }

    static async getAllMsgs(): Promise<msgType[]> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ${this.tableName}`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows as msgType[]);
                }
            });
        });
    }

    static async getAllFileOrTextHashes(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT fileOrTextHash FROM ${this.tableName}`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const hashes = rows.map((row: any) => row.fileOrTextHash);
                    resolve(hashes);
                }
            });
        });
    }

    static async getMsgTypeByHash(hash: string): Promise<msgType> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM ${this.tableName} WHERE fileOrTextHash = ?`, hash, (err: any, row: msgType) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}