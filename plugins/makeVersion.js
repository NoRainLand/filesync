const packageJson = require("../package.json");
const version = packageJson.version;
console.log(`当前项目版本为: ${version}`);
const readline = require("readline");

const fileList = [
    "./rcedit.js",
    ""
]

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// 提问并等待用户输入
rl.question("请输入版本号: ", (answer) => {
	console.log(`新的版本号: ${answer}`);

	rl.close();
});

function makeVersion(version){

}
