export class NiarApp {
    /**
 * aboutMe
 */
    public static theAlone(): any {
        var name: string = "病雨";
        let age: number = NaN;
        let common_langs: Array<string> = ["HTML", "JS", "TS", "PY"];
        let interest: Array<string> = ["听歌", "电子游戏", "看小说", "看设定", "看涩图", "下厨"]
        let learning = ["unity3d", "Laya", "node.js", "blender"]
        let email: string = "d3V4aW5ydWZlbmdAcXEuY29t";
        let obj = {
            name: name,
            age: age,
            common_langs: common_langs,
            interest: interest,
            learning: learning,
            email: email
        }
        console.log(obj);
        return void 0;
    }
}