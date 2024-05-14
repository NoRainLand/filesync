/**公共配置 */
export class CommonConfig {
    /**服务器的 URL */
    static serverURL: string = '127.0.0.1';
    /**http 服务器的端口号 注意，如果端口被占用，会自动加10直到找到空闲端口 */
    static httpPort: number = 4100;
    /**socket 服务器的端口号 注意，如果端口被占用，会自动加10直到找到空闲端口 */
    static socketPort: number = 4200;
}