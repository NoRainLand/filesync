import fs from 'fs';
import { Utils } from './Utils';

export class FileOperation {
    /**删除文件 */
    static async deleteFile(filePath: string) {
        filePath = Utils.getRelativePath(filePath);
        //判断文件是否存在
        if (!filePath || !fs.existsSync(filePath)) {
            console.log('文件不存在' + filePath);
        } else {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log('删除文件失败' + err);
                } else {
                    // console.log('删除文件成功' + filePath);
                }
            });
        }
    }
}