var path = require("path");
var nodeExternals = require("webpack-node-externals");

module.exports = [
	{
		entry: "./dist/client_temp/client/index.js",
		output: {
			path: path.resolve(__dirname, "dist/client"),
			filename: "index.js",
		},
		mode:"development",
		module: {
			rules: [
				{
					test: /\.s[ac]ss$/i,
					use: [
						// 将 JS 字符串生成为 style 节点
						"style-loader",
						// 将 CSS 转化成 CommonJS 模块
						"css-loader",
						// 将 Sass 编译成 CSS
						"sass-loader",
					],
				},
			],
		},
	},
	{
		entry: "./dist/server_temp/server/index.js",
		output: {
			path: path.resolve(__dirname, "dist/server"),
			filename: "index.js",
		},
		externals: [nodeExternals()], // 在 externals 选项中使用 webpack-node-externals
		mode: "production",
		target: "node",
	},
];
