export class ProjectConfig {
    /**项目名称 */
    static readonly projectName: string = 'fileSync';
    /**项目作者 */
    static readonly author: string = 'NoRain';
    /**版本号 */
    static readonly versionStr: string = '5.3.0';
    /**描述 */
    static readonly description: string = '一个简单的文件/文字同步服务器';
    /**前端页面是否屏蔽输出 */
    static readonly closeLog: boolean = false;
    /**前端最大显示消息条数 */
    static readonly maxMsgLen: number = 64;
    /**超出最大消息每次移除消息数量 */
    static readonly removeMsgLen: number = 20;
    /**客户端发送消息间隔 ms */
    static readonly sendTimeout: number = 100;
}