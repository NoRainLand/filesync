export class ProjectConfig {
    /**项目名称 */
    static readonly projectName: string = 'fileSync';
    /**项目作者 */
    static readonly author: string = 'NoRain';
    /**项目版本 每次提交+1 */
    static readonly version: number = 58;
    /**版本号 */
    static readonly versionStr: string = '5.0.0';
    /**前端页面是否开启vconsole */
    static readonly openVC: boolean = false;
    /**前端页面是否屏蔽输出 */
    static readonly closeLog: boolean = false;
    /**前端最大显示消息条数 */
    static readonly maxMsgLen: number = 64;
    /**客户端发送消息间隔 ms */
    static readonly sendTimeout: number = 100;
}