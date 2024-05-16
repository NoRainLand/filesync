export class Utils {
    /**文件尺寸转换 */
    static formatSize(size: number): string {
        if (size < 1024) {
            return size + 'B';
        } else if (size < 1024 * 1024) {
            return (size / 1024).toFixed(2) + 'KB';
        } else if (size < 1024 * 1024 * 1024) {
            return (size / 1024 / 1024).toFixed(2) + 'MB';
        } else {
            return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB';
        }
    }

    /**时间戳转为时分秒 */
    static formatTime(timestamp: number): string {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}