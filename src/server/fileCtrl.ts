import fs from 'fs';
import { GetRelativePath } from './GetRelativePath';
export class FileCtrl {
    static async deleteFile(filePath: string): Promise<void> {
        filePath = GetRelativePath.tranPath(filePath);
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