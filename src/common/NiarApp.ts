import { ProjectConfig } from "../ProjectConfig";

export class NiarApp {
    public static page: any = null;
    static init(page: any) {
        this.page = page;
        this.initJoke();
    }

    /**添加一个joke接口 */
    static initJoke() {
        (<any>window).joke = () => {
            fetch(ProjectConfig.jokeAPI)
                .then((res) => res.json())
                .then((data) => {
                    if (data.joke) {
                        console.log(`%cJoke: %c${data.joke}`, `color: #ff0000;`, `color: #000000;`);
                    } else if (data.setup && data.delivery) {
                        console.log(`%cQ: %c${data.setup}`, `color: #ff0000;`, `color: #000000;`);
                        console.log(`%cA: %c${data.delivery}`, `color: #ff0000;`, `color: #000000;`);
                    } else {
                        console.log("%cUnheihei: %cToday is so heihei that I don't want to tell you a joke.", `color: #ff0000;`, `color: #000000;`);
                    }
                });
            return "Joke is coming...";
        }
    }

    /**
 * aboutMe
 */
    public static execute(owner: string): any {
        if (owner == "me") {
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
            return obj;
        }
        return void 0;
    }
}