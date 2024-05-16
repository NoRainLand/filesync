import fs from 'fs';
import { Utils } from './Utils';
export class FileOperation {

    /**删除文件 */
    static async deleteFile(filePath: string): Promise<void> {
        filePath = Utils.getRelativePath(filePath);
        return new Promise((resolve, reject) => {
            if (!filePath) return Promise.reject();
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}