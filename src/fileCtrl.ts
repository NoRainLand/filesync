import fs from 'fs';
import * as path from 'path';
export class fileCtrl {
    static async deleteFile(fileName: string) {
        return new Promise((resolve, reject) => {
            if(!fileName) return;
            const filePath = path.join(__dirname,"..", fileName);
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(`文件 ${filePath} 删除成功`);
                }
            });
        });
    }
}