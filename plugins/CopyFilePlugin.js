const fs = require("fs");
const path = require("path");

class CopyFilePlugin {
	constructor() {
		this.fileList = [
			{ source: path.resolve(__dirname, "../src/html/apple-touch-icon.png"), target: path.resolve(__dirname, "../bin/client") },
			{ source: path.resolve(__dirname, "../src/html/favicon.ico"), target: path.resolve(__dirname, "../bin/client") },
			{ source: path.resolve(__dirname, "../src/html/index.html"), target: path.resolve(__dirname, "../bin/client") },
			{ source: path.resolve(__dirname, "../tool/QuickSendTool.exe"), target: path.resolve(__dirname, "../bin/tool") },
		];
	}

	apply(compiler) {
		// 使用 done hook 确保在编译完成后执行
		compiler.hooks.done.tap("CopyFilePlugin", (stats) => {
			this.fileList.forEach((file) => {
				// 确保目标目录存在
				fs.mkdirSync(file.target, { recursive: true });
				try {
					fs.copyFileSync(file.source, path.join(file.target, path.basename(file.source)));
					console.log(`文件：${file.source} 已经复制到 ${file.target}`);
				} catch (err) {
					console.error(`复制文件错误：${file.source}`, err);
				}
			});
		});
	}
}

module.exports = CopyFilePlugin;
