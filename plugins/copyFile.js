const fs = require("fs");
const path = require("path");

var sourcePath = "./src/html";
var targetPath = "./dist/client";
var blackList = ["font", "css"];

async function copyFilesB(sourcePath, targetPath, blackList) {
	const files = await fs.promises.readdir(sourcePath);
	for (const file of files) {
		const from = path.resolve(sourcePath, file);
		const to = path.resolve(targetPath, file);

		// // 检查文件或目录是否在黑名单中，或者它们的父目录是否在黑名单中
		// if (blackList.some((blackListItem) => from.startsWith(path.resolve(sourcePath, blackListItem)))) {
		// 	continue;
		// }

		const stat = await fs.promises.stat(from);
		if (stat.isDirectory()) {
			// 如果是目录，递归复制
			await fs.promises.mkdir(to, { recursive: true });
			await copyFilesB(from, to, blackList);
		} else if (stat.isFile()) {
			// 如果是文件，直接复制
            await fs.promises.mkdir(path.dirname(to), { recursive: true });
			await fs.promises.copyFile(from, to);
		}
	}
}

async function deleteFiles(targetPath, cacheFilePath) {
	for (const cacheFile of cacheFilePath) {
		const filePath = path.resolve(targetPath, cacheFile);
		try {
			await fs.promises.access(filePath);
			await fs.promises.rm(filePath, { recursive: true, force: true });
		} catch (e) {
			// 文件不存在，不需要删除
		}
	}
}

async function copyFilesC(sourcePath, targetPath, blackList) {
	const files = await fs.promises.readdir(sourcePath);
	for (const file of files) {
		const from = path.resolve(sourcePath, file);
		const to = path.resolve(targetPath, file);

		// 检查文件或目录是否在黑名单中
		let isInBlackList = blackList.some((blackListItem) => {
			const relativePath = path.relative(sourcePath, from);
			return relativePath.startsWith(blackListItem);
		});

		if (!isInBlackList) {
			const stat = await fs.promises.stat(from);
			if (stat.isDirectory()) {
				// 如果是目录，递归复制
				await fs.promises.mkdir(to, { recursive: true });
				await copyFilesC(from, to, blackList);
			} else if (stat.isFile()) {
				// 如果是文件，检查源文件是否存在
				try {
					await fs.promises.access(from);
					console.log(`复制文件: ${from} 到 ${to}`);
                    await fs.promises.mkdir(path.dirname(to), { recursive: true });
					await fs.promises.copyFile(from, to);
				} catch (e) {
					console.log(`源文件不存在: ${from}`);
				}
			}
		}
	}
}

function deleteCache() {
	return deleteFiles(targetPath, blackList);
}
function copyCache() {
	return copyFilesC(sourcePath, targetPath, blackList);
}
async function copyFile() {
	await copyFilesB(sourcePath, targetPath, blackList);

	let sourcePath2 = "./tool";
	let targetPath2 = "./dist/tool";
	await copyFilesB(sourcePath2, targetPath2, blackList);
}

module.exports = {
	copyCache,
	deleteCache,
	copyFile,
};
copyFile();
