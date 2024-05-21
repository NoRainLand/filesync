export class Config {
    /**服务器的 URL */
    static serverURL: string = '127.0.0.1';
    /**socket  */
    static socketPort: number = 4200;
    /**程序版本 */
    static version: string = "1.0.0";
    /**项目名称 */
    static projectName: string;
    /**作者 */
    static author: string = "NoRain";
    /**描述 */
    static description: string = "一个简单的文件/文字同步服务器";


    /**http服务器的api接口 */
    static readonly httpApiMap = {
        getSocketInfo: "/getSocketInfo",
        upload: "/upload",
    }
    /**显示进度条的最小文件体积 */
    static readonly showProgressMinSize: number = 1024 * 1024 * 64;
   

}
