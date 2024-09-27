const rcedit = require("rcedit");

const options = {
	"version-string": {
		ProductName: "filesync",
		FileDescription: "基于node开发的一个多端文件/文字同步工具",
		FileVersion: "5.3.1",
		ProductVersion: "5.3.1",
		OriginalFilename: "filesync.exe",
		InternalName: "filesync.exe",
		CompanyName: "unknownmothergoose",
		LegalCopyright: "Copyright © 2023-2024 NoRain",
	},
	"file-version": "3.14159.26535.897.932.384.626",
	"product-version": "5.3.1",
	icon: "./logo/fs.ico",
};

const fetched = ".pkg-cache/v3.4/fetched-v16.16.0-win-x64";
const built = ".pkg-cache/v3.4/built-v16.16.0-win-x64";

async function main() {
	try {
		await rcedit(fetched, options);
        await rcedit(built, options);
		console.log("Executable file has been updated.");
	} catch (error) {
		console.error("Error while updating executable file:", error);
	}
}

main();
