const fs = require("fs");
const path = require("path");

const deletePath = ["./dist", "./exec"];

deletePath.forEach((file) => {
	if (fs.existsSync(file)) {
		fs.unlink(file, { recursive: true }, (err) => {
			if (err) {
				console.error("删除文件错误", err);
				return;
			}
			console.log(`文件：${file}已经删除`);
		});
	}
});
