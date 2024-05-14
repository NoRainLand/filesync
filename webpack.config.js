var path = require("path");
var nodeExternals = require('webpack-node-externals');

module.exports = [
	{
		entry: "./dist/client_temp/client/index.js",
		output: {
			path: path.resolve(__dirname, "dist/client"),
			filename: "index.js",
		},
		mode: "production",
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
