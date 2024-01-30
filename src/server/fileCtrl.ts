import fs from 'fs';
import { getRelativePath } from './getRelativePath';
export class fileCtrl {
    static async deleteFile(filePath: string): Promise<void> {
        filePath = getRelativePath.tranPath(filePath);
        console.warn(filePath);
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