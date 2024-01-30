import path from "path";

export class getRelativePath {
    /**获取相对代码运行的路径 */
    static tranPath(sourcePath: string, extraPath: string = "") {
        if ((<any>process).pkg) {
            return path.join(process.cwd(), sourcePath.substring(1));//因为打包之后执行路径会变成.exe的相对路径，所以需要减少一位。
        } else {
            return path.join(__dirname, extraPath, sourcePath);
        }
    }
}