import path from "path";

export class GetRelativePath {
    /**获取相对代码运行的路径 */
    static tranPath(sourcePath: string, extraPath: string = "") {
        if ((<any>process).pkg) {
            return path.join(process.cwd(), sourcePath.substring(1));//因为打包之后执行路径会变成相对.exe文件的路径，所以需要减少一位 "."。
        } else {
            return path.join(__dirname, extraPath, sourcePath);
        }
    }
}