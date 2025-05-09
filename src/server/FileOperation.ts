import fs from 'fs/promises';  // 使用 promises API
import { existsSync } from 'fs';
import { Utils } from './Utils';

export class FileOperation {
    /**
     * 删除文件
     * @param {string} filePath 要删除的文件路径
     * @throws {Error} 当文件删除失败时抛出错误
     * @returns {Promise<void>}
     */
    static async deleteFile(filePath: string): Promise<void> {
        if (!filePath) {
            throw new Error('文件路径不能为空');
        }
        filePath = Utils.getRelativePath(filePath);
        if (!existsSync(filePath)) {
            throw new Error(`文件不存在: ${filePath}`);
        }
        try {
            await fs.unlink(filePath);
            // console.log(`文件删除成功: ${resolvedPath}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`删除文件失败: ${errorMessage}`);
        }
    }
}