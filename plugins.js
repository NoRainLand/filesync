const fs = require("fs-extra");
const path = require("path");

var sourcePath = "./src/html";
var targetPath = "./dist/client";
var blackList = ["font", "css"];

async function copyFilesB(sourcePath, targetPath, blackList) {
	const files = await fs.readdir(sourcePath);
	for (const file of files) {
		const from = path.resolve(sourcePath, file);
		const to = path.resolve(targetPath, file);

		// 检查文件或目录是否在黑名单中，或者它们的父目录是否在黑名单中
		if (blackList.some((blackListItem) => from.startsWith(path.resolve(sourcePath, blackListItem)))) {
			continue;
		}

		const stat = await fs.stat(from);
		if (stat.isDirectory()) {
			// 如果是目录，递归复制
			await fs.ensureDir(to);
			await copyFilesB(from, to, blackList);
		} else if (stat.isFile()) {
			// 如果是文件，直接复制
			await fs.copy(from, to);
		}
	}
}

async function deleteFiles(targetPath, cacheFilePath) {
	for (const cacheFile of cacheFilePath) {
		const filePath = path.resolve(targetPath, cacheFile);
		try {
			await fs.rm(filePath, { recursive: true, force: true });
		} catch (err) {
			console.error(`Error while deleting ${filePath}.`, err);
		}
	}
}

async function copyFilesC(sourcePath, targetPath, blackList) {
	const files = await fs.readdir(sourcePath);
	for (const file of files) {
		const from = path.resolve(sourcePath, file);
		const to = path.resolve(targetPath, file);
		console.log(from);
		// 检查文件或目录是否在黑名单中，或者它们的父目录是否在黑名单中
		let isInBlackList = false;
		for (let i = 0; i < blackList.length; i++) {
			if (from.indexOf(path.resolve(sourcePath, blackList[i])) != -1 || from.indexOf(path.resolve(sourcePath)) != -1) {
				isInBlackList = true;
				break;
			}
		}
		if (isInBlackList) {
			const stat = await fs.stat(from);
			if (stat.isDirectory()) {
				// 如果是目录，递归复制
				await fs.ensureDir(to);
				await copyFilesC(from, to, blackList);
			} else if (stat.isFile()) {
				// 如果是文件，直接复制
				await fs.copy(from, to);
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
function copyFile() {
	copyFilesB(sourcePath, targetPath, blackList);
}

module.exports = {
	copyCache,
	deleteCache,
	copyFile,
};
