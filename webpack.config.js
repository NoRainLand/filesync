const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { copyCache, deleteCache } = require("./plugins/copyFile");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackObfuscator = require("webpack-obfuscator");

module.exports = [
	{
		entry: "./dist/client_temp/client/index.js",
		output: {
			path: path.resolve(__dirname, "dist/client"),
			filename: "index.js",
		},
		mode: "production",// "development" | "production" | "none"
		module: {
			rules: [
				{
					test: /\.s[ac]ss$/i,
					use: ["style-loader", "css-loader", "sass-loader"],
				},
			],
		},
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						compress: {
							drop_console: false,//是否移除console
						},
					},
				}),
			],
		},
		plugins: [
			new WebpackObfuscator(
				{
					rotateStringArray: true,
				},
				[]
			),
			{
				apply: (compiler) => {
					compiler.hooks.beforeRun.tapPromise("CopyFilesPlugin", async () => {
						await copyCache();
					});
					compiler.hooks.done.tapPromise("DeleteFilesPlugin", async () => {
						await deleteCache();
					});
				},
			},
		],
	},
	{
		entry: "./dist/server_temp/server/index.js",
		output: {
			path: path.resolve(__dirname, "dist/server"),
			filename: "index.js",
		},
		externals: [nodeExternals()],
		mode: "production",
		target: "node",
	},
];
