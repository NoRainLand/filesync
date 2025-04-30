import fs from 'fs';
import sqlite3 from 'sqlite3';
import { MsgData } from '../common/CommonDefine';
import { ServerConfig } from './ServerConfig';
import { SQLCAMMAND } from './ServerDefine';
import { Utils } from './Utils';

/**数据库操作类 */
export class DatabaseOperation {
    private static db: sqlite3.Database = null!;
    private static tableName: string = "";
    private static dbIsOpen: boolean = false;
    private static needWellcomeMsg: boolean = false;
    private static dbPath: string;

    /**
     * 开启数据库
     */
    static async openDatabase(dbPath: string, tableName: string): Promise<void> {
        if (this.dbIsOpen) {
            console.warn('数据库已经打开');
            return;
        }

        this.dbPath = dbPath;
        this.tableName = tableName;
        this.needWellcomeMsg = fs.existsSync(this.dbPath);

        try {
            // 先创建数据库连接
            this.db = new sqlite3.Database(this.dbPath);
            this.dbIsOpen = true;

            try {
                // 创建表
                await this.createTable();
                console.log("数据库已开启:", this.dbPath);
            } catch (error) {
                // 如果创建表失败，确保关闭数据库连接
                await this.closeDatabase();
                throw error;
            }
        } catch (error) {
            // 重置所有状态
            this.dbIsOpen = false;
            // this.db = null;
            console.error('初始化数据库失败:', error);
            throw error;
        }
    }

    /**
     * 关闭数据库
     */
    static async closeDatabase(): Promise<void> {
        if (!this.dbIsOpen) {
            return;
        }

        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    console.error('关闭数据库失败:', err);
                    reject(err);
                    return;
                }
                this.dbIsOpen = false;
                console.log('数据库已安全关闭');
                resolve();
            });
        });
    }

    /**
     * 创建数据库表
     */
    private static async createTable(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(this.getSqlCommand(SQLCAMMAND.CREATETABLE), async (err) => {
                if (err) {
                    await this.closeDatabase();
                    reject(err);
                    return;
                }

                if (!this.needWellcomeMsg) {
                    try {
                        await this.writeToDatabase(ServerConfig.welcomeMsg);
                    } catch (error) {
                        reject(error);
                        return;
                    }
                }
                resolve();
            });
        });
    }

    /**
     * 写入数据库
     */
    static async writeToDatabase(msg: MsgData): Promise<void> {
        this.checkDatabaseStatus();
        return new Promise((resolve, reject) => {
            const { fileName, fileOrTextHash, timestamp, text, msgType, url, size, hashName: originalname } = msg;
            this.db.run(
                this.getSqlCommand(SQLCAMMAND.WRITETODATABASE),
                [fileName, fileOrTextHash, timestamp, text, msgType, url, size, originalname],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    /**
     * 从数据库删除
     */
    static async deleteFromDatabase(hash: string): Promise<void> {
        this.checkDatabaseStatus();
        return new Promise((resolve, reject) => {
            this.db.run(this.getSqlCommand(SQLCAMMAND.DELETEFROMDATABASE), hash, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * 获取所有消息
     */
    static async getAllMsgs(): Promise<MsgData[]> {
        this.checkDatabaseStatus();
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

    /**
     * 获取所有文件或文本的hash
     */
    static async getAllFileOrTextHashes(): Promise<string[]> {
        this.checkDatabaseStatus();
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

    /**
     * 获取所有文件的hash和文件名的映射
     */
    static async getFileHashAndFileNameMap(): Promise<Map<string, string>> {
        this.checkDatabaseStatus();
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

    /**
     * 根据hash获取消息
     */
    static async getMsgDataByHash(hash: string): Promise<MsgData> {
        this.checkDatabaseStatus();
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

    /**
     * 获取文件名到hash名的映射
     */
    static async getFileName2HashNameMap(): Promise<Map<string, string>> {
        this.checkDatabaseStatus();
        return new Promise((resolve, reject) => {
            this.db.all(
                this.getSqlCommand(SQLCAMMAND.GETFILENAME2HASHNAMEMAP),
                (err: any, rows: Array<{ fileName: string, originalname: string }>) => {
                    if (err) {
                        reject(err);
                    } else {
                        const map = new Map<string, string>();
                        for (const row of rows) {
                            map.set(row.fileName, row.originalname);
                        }
                        resolve(map);
                    }
                }
            );
        });
    }

    /**
     * 检查数据库状态
     */
    private static checkDatabaseStatus(): void {
        if (!this.dbIsOpen) {
            throw new Error('数据库未打开');
        }
    }

    /**
     * 获取SQL命令
     */
    private static getSqlCommand(command: SQLCAMMAND, tableName?: string): string {
        tableName = tableName || this.tableName;
        switch (command) {
            case SQLCAMMAND.CREATETABLE:
                return `CREATE TABLE IF NOT EXISTS ${tableName} (
                    fileName TEXT,
                    fileOrTextHash TEXT,
                    timestamp INTEGER,
                    text TEXT,
                    msgType TEXT,
                    url TEXT,
                    size INTEGER,
                    originalname TEXT
                )`;
            case SQLCAMMAND.WRITETODATABASE:
                return `INSERT INTO ${tableName} (
                    fileName,
                    fileOrTextHash,
                    timestamp,
                    text,
                    msgType,
                    url,
                    size,
                    originalname
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
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