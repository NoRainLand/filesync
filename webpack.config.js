const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");
const { url } = require("inspector");
const nodeExternals = require("webpack-node-externals");
const CopyFilePlugin = require("./plugins/CopyFilePlugin.js");

// 创建客户端配置
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
        new CopyFilePlugin()
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
module.exports = (env, argv) => [clientConfig, serverConfig];
