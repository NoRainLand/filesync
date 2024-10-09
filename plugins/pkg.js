const { execSync } = require("child_process");
const path = require("path");

const pkg = {
	assets: ["../dist/client/**/*", "../dist/server/**/*", "../node_modules/sqlite3/build/Release/node_sqlite3.node", "../dist/tool/QuickSendTool.exe"],
	outputPath: "../exec",
};

// 设置临时缓存目录
const cachePath = path.resolve(__dirname, "../.pkg-cache");
process.env.PKG_CACHE_PATH = cachePath;

// 运行 pkg 命令
try {
	const pkgCommand = ["pkg", "-t", "win", "package.json", "--compress", "GZip", "--out-path", pkg.outputPath, ...pkg.assets.map((asset) => `--assets ${asset}`)].join(" ");
	execSync(pkgCommand, { stdio: "inherit" });
	console.log("pkg 打包成功");
} catch (error) {
	console.error("pkg 打包失败", error);
}
