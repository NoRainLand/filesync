const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");
const { url } = require("inspector");
const nodeExternals = require("webpack-node-externals");

//复制插件
class CopyFilePlugin {
	constructor() {
		this.fileList = [
			{ source: path.resolve(__dirname, "./src/html/apple-touch-icon.png"), target: path.resolve(__dirname, "./bin/client") },
			{ source: path.resolve(__dirname, "./src/html/favicon.ico"), target: path.resolve(__dirname, "./bin/client") },
			{ source: path.resolve(__dirname, "./src/html/index.html"), target: path.resolve(__dirname, "./bin/client") },
			{ source: path.resolve(__dirname, "./tool/QuickSendTool.exe"), target: path.resolve(__dirname, "./bin/tool") },
		];
	}

	apply(compiler) {
		compiler.hooks.done.tap("CopyFilePlugin", (stats) => {
			this.fileList.forEach((file) => {
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

// 删除插件
class DeleteFilePlugin {
	constructor() {
		this.fileList = [{ target: path.resolve(__dirname, "./bin/client/desktop.js") }, { target: path.resolve(__dirname, "./bin/client/mobile.js") }];
	}
	apply(compiler) {
		compiler.hooks.done.tap("DeleteFilePlugin", (stats) => {
			this.fileList.forEach((file) => {
				if (fs.existsSync(file.target)) {
					fs.unlinkSync(file.target);
					console.log(`删除文件：${file.target}`);
				}
			});
		});
	}
}

// css配置
const cssConfig = {
	entry: {
		desktop: "./src/html/css/desktop.scss", // desktop.scss 入口
		mobile: "./src/html/css/mobile.scss", // mobile.scss 入口
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),
		new DeleteFilePlugin(),
	],
	output: {
		path: path.resolve(__dirname, "bin/client"),
	},
};

// 客户端配置
const clientConfig = {
	name: "client",
	entry: {
		client: "./src/client/index.ts",
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "bin/client"),
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				include: [path.resolve(__dirname, "src/client"), path.resolve(__dirname, "src/common"), path.resolve(__dirname, "src/ProjectConfig.ts")],
				use: {
					loader: "ts-loader",
					options: {
						configFile: "tsconfig.client.json",
					},
				},
			},
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),
		new CopyFilePlugin(),
	],
};

// 创建服务器配置
const serverConfig = {
	name: "server",
	entry: {
		server: "./src/server/index.ts",
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "bin/server"),
	},
	target: "node",
	resolve: {
		extensions: [".ts", ".js"],
	},
	performance: {
		hints: false,
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				include: [path.resolve(__dirname, "src/server"), path.resolve(__dirname, "src/common"), path.resolve(__dirname, "src/ProjectConfig.ts")],
				use: {
					loader: "ts-loader",
					options: {
						configFile: "tsconfig.server.json",
					},
				},
			},
		],
		exprContextCritical: false,
	},
	externals: [nodeExternals()],
};

// 导出配置数组
module.exports = (env = {}, argv) => {
	// 根据环境变量选择要打包的配置
	if (env.target) {
		switch (env.target.toLowerCase()) {
			case "css":
				console.log("仅打包 CSS...");
				return [cssConfig];
			case "client":
				console.log("仅打包客户端...");
				return [clientConfig];
			case "server":
				console.log("仅打包服务器...");
				return [serverConfig];
			default:
				console.log("无效的打包目标");
				return [];
		}
	}

	// 默认打包所有
	console.log("打包所有模块...");
	return [cssConfig, clientConfig, serverConfig];
};
