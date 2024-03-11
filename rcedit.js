const rcedit = require("rcedit");

const options = {
	"version-string": {
		ProductName: "filesync",
		FileDescription: "一个简单的文件/文字同步工具",
		FileVersion: "4.0.0",
		ProductVersion: "4.0.0",
		OriginalFilename: "filesync.exe",
		InternalName: "filesync.exe",
		CompanyName: "unknown",
        LegalCopyright:"Copyright © 2023-2024 NoRain"
	},
	"file-version": "3.14159.26535.897.932.384.626",
	"product-version": "4.0.0",
	icon: "./dist/client/favicon.ico",
};

const exePath = ".pkg-cache/v3.4/built-v14.20.0-win-x64";

async function main() {
	try {
		await rcedit(exePath, options);
		console.log("Executable file has been updated.");
	} catch (error) {
		console.error("Error while updating executable file:", error);
	}
}

main();
