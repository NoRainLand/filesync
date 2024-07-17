const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { copyCache, deleteCache } = require("./plugins/copyFile");

module.exports = [
	{
		entry: "./dist/client_temp/client/index.js",
		output: {
			path: path.resolve(__dirname, "dist/client"),
			filename: "index.js",
		},
		mode: "production",
		module: {
			rules: [
				{
					test: /\.s[ac]ss$/i,
					use: ["style-loader", "css-loader", "sass-loader"],
				},
			],
		},
		plugins: [
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
