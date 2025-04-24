const { execSync } = require("child_process");
const path = require("path");
// 配置选项
const CONFIG = {
	cache: path.resolve(__dirname, "../.pkg-cache"),
	pkg: path.resolve(__dirname, "../package.json"),
	output: path.resolve(__dirname, "../exec"),
	target: "win",
	compression: "GZip",
};

// 执行打包
function buildPackage() {
	// 设置缓存路径
	process.env.PKG_CACHE_PATH = CONFIG.cache;

	try {
		const pkgCommand = ["pkg", "-t", CONFIG.target, CONFIG.pkg, "--compress", CONFIG.compression, "--out-path", CONFIG.output].join(" ");
		console.log("开始打包...");
		execSync(pkgCommand, {
			stdio: "inherit",
			encoding: "utf8",
		});
		console.log("打包成功");
		return true;
	} catch (error) {
		console.error("打包失败:", error.message);
		return false;
	}
}

function main() {
	try {
		return buildPackage();
	} catch (error) {
		console.error("程序执行失败:", error.message);
		return false;
	}
}

process.exit(main() ? 0 : 1);
