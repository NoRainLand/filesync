const fs = require("fs");

const oldVersion = "5.5.0";

const fileList = ["./package.json", "./src/ProjectConfig.ts", "./plugins/rcedit.js", "./plugins/changeVersion.js"];

let newVersion = process.argv[2];
if (newVersion) {
	fileList.forEach((file) => {
		fs.readFile(file, "utf8", (err, data) => {
			if (err) {
				console.error("读取文件错误", err);
				return;
			}
			const result = data.replace(new RegExp(oldVersion, 'g'), newVersion);
			fs.writeFile(file, result, "utf8", (err) => {
				if (err) {
					console.error(`写入文件错误：${file}`, err);
					return;
				}
				console.log(`文件：${file}已经更新`);
			});
		});
	});
	console.log("修改完毕，请记得写README.md");
} else {
	console.error("请输入新版本号");
	return;
}
