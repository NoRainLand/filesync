/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ProjectConfig.ts":
/*!******************************!*\
  !*** ./src/ProjectConfig.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ProjectConfig = void 0;\nclass ProjectConfig {\n}\nexports.ProjectConfig = ProjectConfig;\n/**项目名称 */\nProjectConfig.projectName = 'fileSync';\n/**项目作者 */\nProjectConfig.author = 'NoRain';\n/**版本号 */\nProjectConfig.versionStr = '5.4.4';\n/**描述 */\nProjectConfig.description = '一个简单的文件/文字同步服务器';\n/**前端页面是否屏蔽输出 */\nProjectConfig.closeLog = false;\n/**前端最大显示消息条数 */\nProjectConfig.maxMsgLen = 64;\n/**超出最大消息每次移除消息数量 */\nProjectConfig.removeMsgLen = 20;\n/**客户端发送消息间隔 ms */\nProjectConfig.sendTimeout = 100;\n/**jokeAPI */\nProjectConfig.jokeAPI = 'https://v2.jokeapi.dev/joke/Any';\n\n\n//# sourceURL=webpack://file-sync/./src/ProjectConfig.ts?");

/***/ }),

/***/ "./src/common/CommonDefine.ts":
/*!************************************!*\
  !*** ./src/common/CommonDefine.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ServerClientOperate = void 0;\n/**socket服务器客户端交互 */\nvar ServerClientOperate;\n(function (ServerClientOperate) {\n    /**添加消息 服务器主动下发*/\n    ServerClientOperate[\"ADD\"] = \"ADD\";\n    /**删除消息 服务器主动下发*/\n    ServerClientOperate[\"DELETE\"] = \"DELETE\";\n    /**全量消息 客户端主动请求全部消息*/\n    ServerClientOperate[\"FULL\"] = \"FULL\";\n    /**心跳 客户端主动请求，服务器原样返回*/\n    ServerClientOperate[\"HEARTBEAT\"] = \"HEARTBEAT\";\n    /**刷新 客户端主动请求，服务器返回最后操作时间戳*/\n    ServerClientOperate[\"REFRESH\"] = \"REFRESH\";\n    /**错误 服务器主动下发 */\n    ServerClientOperate[\"ERROR\"] = \"ERROR\";\n})(ServerClientOperate || (exports.ServerClientOperate = ServerClientOperate = {}));\n\n\n//# sourceURL=webpack://file-sync/./src/common/CommonDefine.ts?");

/***/ }),

/***/ "./src/common/EventMgr.ts":
/*!********************************!*\
  !*** ./src/common/EventMgr.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.EventMgr = void 0;\nconst Handler_1 = __webpack_require__(/*! ./Handler */ \"./src/common/Handler.ts\");\n/**事件管理器 */\nclass EventMgr {\n    static on(event, callback, caller) {\n        let arr;\n        if (!this.eventMap.has(event)) {\n            this.eventMap.set(event, []);\n        }\n        arr = this.eventMap.get(event);\n        let hd = Handler_1.Handler.createHandler(caller, callback, false);\n        arr.push(hd);\n        this.eventMap.set(event, arr);\n    }\n    static once(event, callback, caller) {\n        let arr;\n        if (!this.eventMap.has(event)) {\n            this.eventMap.set(event, []);\n        }\n        arr = this.eventMap.get(event);\n        let hd = Handler_1.Handler.createHandler(caller, callback, true);\n        arr.push(hd);\n        this.eventMap.set(event, arr);\n    }\n    static off(event, callback, caller) {\n        if (this.eventMap.has(event)) {\n            let arr = this.eventMap.get(event);\n            for (let i = 0; i < arr.length; i++) {\n                let hd = arr[i];\n                if (hd.isMe(caller, callback)) {\n                    arr.splice(i, 1);\n                    i--;\n                    Handler_1.Handler.recoverHandler(hd);\n                }\n            }\n        }\n    }\n    static offAll(caller) {\n        this.eventMap.forEach((value, key) => {\n            for (let i = 0; i < value.length; i++) {\n                let hd = value[i];\n                if (hd.isCaller(caller)) {\n                    value.splice(i, 1);\n                    i--;\n                    Handler_1.Handler.recoverHandler(hd);\n                }\n            }\n        });\n    }\n    static offAllEvent(event) {\n        if (this.eventMap.has(event)) {\n            let arr = this.eventMap.get(event);\n            for (let i = 0; i < arr.length; i++) {\n                let hd = arr[i];\n                Handler_1.Handler.recoverHandler(hd);\n            }\n            this.eventMap.delete(event);\n        }\n    }\n    static offAllEvents() {\n        this.eventMap.forEach((value, key) => {\n            for (let i = 0; i < value.length; i++) {\n                let hd = value[i];\n                Handler_1.Handler.recoverHandler(hd);\n            }\n        });\n        this.eventMap.clear();\n    }\n    static emit(event, ...args) {\n        if (this.eventMap.has(event)) {\n            let arr = this.eventMap.get(event);\n            for (let i = 0; i < arr.length; i++) {\n                let hd = arr[i];\n                hd.runWith(args);\n                if (hd.isOnce) {\n                    arr.splice(i, 1);\n                    i--;\n                    Handler_1.Handler.recoverHandler(hd);\n                }\n            }\n        }\n    }\n}\nexports.EventMgr = EventMgr;\nEventMgr.eventMap = new Map();\n\n\n//# sourceURL=webpack://file-sync/./src/common/EventMgr.ts?");

/***/ }),

/***/ "./src/common/Handler.ts":
/*!*******************************!*\
  !*** ./src/common/Handler.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Handler = void 0;\nconst Pool_1 = __webpack_require__(/*! ./Pool */ \"./src/common/Pool.ts\");\nclass Handler {\n    constructor() {\n        this._isOnce = true;\n        this._isRecover = true;\n    }\n    static createHandler(caller, callback, isOnce = true) {\n        let hd = this.getHandler();\n        hd = this.setHandler(caller, callback, hd, isOnce);\n        return hd;\n    }\n    static getHandler() {\n        let hd = this.pool.get();\n        hd._isRecover = false;\n        return hd;\n    }\n    static setHandler(caller, callback, handler, isOnce = true) {\n        handler._caller = caller;\n        handler._callback = callback;\n        handler._isOnce = isOnce;\n        return handler;\n    }\n    static recoverHandler(handler) {\n        if (handler && handler instanceof Handler && handler.isRecover == false) {\n            handler._reset();\n            this.pool.recycle(handler);\n        }\n    }\n    //------self------\n    _reset() {\n        this._caller = null;\n        this._callback = null;\n        this._isOnce = true;\n        this._isRecover = true;\n    }\n    get isOnce() {\n        return this._isOnce;\n    }\n    get isRecover() {\n        return this._isRecover;\n    }\n    run() {\n        var _a;\n        if (!this._isRecover) {\n            (_a = this._callback) === null || _a === void 0 ? void 0 : _a.call(this._caller);\n            if (this._isOnce) {\n                Handler.recoverHandler(this);\n            }\n        }\n    }\n    runWith(parms) {\n        var _a;\n        if (!this._isRecover) {\n            (_a = this._callback) === null || _a === void 0 ? void 0 : _a.apply(this._caller, parms);\n            if (this._isOnce) {\n                Handler.recoverHandler(this);\n            }\n        }\n    }\n    isMe(caller, callback) {\n        return this._caller == caller && this._callback == callback;\n    }\n    isCaller(caller) {\n        return this._caller == caller;\n    }\n}\nexports.Handler = Handler;\nHandler.pool = new Pool_1.Pool(() => new Handler());\n\n\n//# sourceURL=webpack://file-sync/./src/common/Handler.ts?");

/***/ }),

/***/ "./src/common/Pool.ts":
/*!****************************!*\
  !*** ./src/common/Pool.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Pool = void 0;\nclass Pool {\n    constructor(createObject) {\n        this.createObject = createObject;\n        this.pool = [];\n    }\n    forEach(callback) {\n        this.pool.forEach(callback);\n    }\n    get() {\n        if (this.pool.length > 0) {\n            this.pool = this.pool.reverse(); //翻转\n            return this.pool.pop();\n        }\n        else {\n            return this.createObject();\n        }\n    }\n    recycle(obj) {\n        this.pool.push(obj);\n    }\n}\nexports.Pool = Pool;\n\n\n//# sourceURL=webpack://file-sync/./src/common/Pool.ts?");

/***/ }),

/***/ "./src/server/DatabaseOperation.ts":
/*!*****************************************!*\
  !*** ./src/server/DatabaseOperation.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DatabaseOperation = void 0;\nconst fs_1 = __importDefault(__webpack_require__(/*! fs */ \"fs\"));\nconst sqlite3_1 = __importDefault(__webpack_require__(/*! sqlite3 */ \"sqlite3\"));\nconst ServerConfig_1 = __webpack_require__(/*! ./ServerConfig */ \"./src/server/ServerConfig.ts\");\nconst ServerDefine_1 = __webpack_require__(/*! ./ServerDefine */ \"./src/server/ServerDefine.ts\");\nconst Utils_1 = __webpack_require__(/*! ./Utils */ \"./src/server/Utils.ts\");\n/**数据库操作类 */\nclass DatabaseOperation {\n    /**开启数据库 */\n    static openDatabase(dbPath, tableName) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (this.dbIsOpen)\n                return Promise.resolve();\n            this.dbPath = Utils_1.Utils.getRelativePath(dbPath);\n            this.dbExists = fs_1.default.existsSync(this.dbPath);\n            yield new Promise((resolve, reject) => {\n                this.tableName = tableName;\n                this.db = new sqlite3_1.default.Database(this.dbPath, (err) => {\n                    if (err) {\n                        reject(err);\n                    }\n                    else {\n                        resolve(this.createTable());\n                    }\n                });\n            });\n        });\n    }\n    /**创建数据库表 */\n    static createTable() {\n        return __awaiter(this, void 0, void 0, function* () {\n            let self = this;\n            yield new Promise((resolve, reject) => {\n                self.db.run(self.getSqlCommand(ServerDefine_1.SQLCAMMAND.CREATETABLE), (err) => {\n                    if (err) {\n                        self.db.close();\n                        reject(err);\n                    }\n                    else {\n                        self.dbIsOpen = true;\n                        if (!self.dbExists) {\n                            resolve(self.writeToDatabase(ServerConfig_1.ServerConfig.welcomeMsg));\n                        }\n                        else {\n                            console.log(\"数据库已开启：\");\n                            console.log(this.dbPath);\n                            resolve(null);\n                        }\n                    }\n                });\n            });\n        });\n    }\n    /**写入数据库 */\n    static writeToDatabase(msg) {\n        if (!this.dbIsOpen)\n            return Promise.resolve();\n        return new Promise((resolve, reject) => {\n            const { fileName, fileOrTextHash, timestamp, text, msgType, url, size, hashName: originalname } = msg;\n            this.db.run(this.getSqlCommand(ServerDefine_1.SQLCAMMAND.WRITETODATABASE), [fileName, fileOrTextHash, timestamp, text, msgType, url, size, originalname], (err) => {\n                if (err) {\n                    reject(err);\n                }\n                else {\n                    resolve();\n                }\n            });\n        });\n    }\n    /**从数据库删除 */\n    static deleteFromDatabase(hash) {\n        if (!this.dbIsOpen)\n            return Promise.resolve();\n        return new Promise((resolve, reject) => {\n            this.db.run(this.getSqlCommand(ServerDefine_1.SQLCAMMAND.DELETEFROMDATABASE), hash, (err) => {\n                if (err) {\n                    reject(err);\n                }\n                else {\n                    resolve();\n                }\n            });\n        });\n    }\n    /**获取所有消息 */\n    static getAllMsgs() {\n        if (!this.dbIsOpen)\n            return Promise.resolve([]);\n        return new Promise((resolve, reject) => {\n            this.db.all(this.getSqlCommand(ServerDefine_1.SQLCAMMAND.GETALLMSGS), (err, rows) => {\n                if (err) {\n                    reject(err);\n                }\n                else {\n                    resolve(rows);\n                }\n            });\n        });\n    }\n    /**获取所有文件或文本的hash */\n    static getAllFileOrTextHashes() {\n        if (!this.dbIsOpen)\n            return Promise.resolve([]);\n        return new Promise((resolve, reject) => {\n            this.db.all(this.getSqlCommand(ServerDefine_1.SQLCAMMAND.GETALLFILEORTEXTHASHES), [], (err, rows) => {\n                if (err) {\n                    reject(err);\n                }\n                else {\n                    const hashes = rows.map((row) => row.fileOrTextHash);\n                    resolve(hashes);\n                }\n            });\n        });\n    }\n    /**获取所有文件的的hash和文件源码的map */\n    static getFileHashAndFileNameMap() {\n        if (!this.dbIsOpen)\n            return Promise.resolve(new Map());\n        return new Promise((resolve, reject) => {\n            this.db.all(this.getSqlCommand(ServerDefine_1.SQLCAMMAND.GETALLFILEHASHES), [], (err, rows) => {\n                if (err) {\n                    reject(err);\n                }\n                else {\n                    const map = new Map();\n                    for (const row of rows) {\n                        map.set(row.fileOrTextHash, row.fileName);\n                    }\n                    resolve(map);\n                }\n            });\n        });\n    }\n    /**根据hash获取消息 */\n    static getMsgDataByHash(hash) {\n        if (!this.dbIsOpen)\n            return Promise.resolve({});\n        return new Promise((resolve, reject) => {\n            this.db.get(this.getSqlCommand(ServerDefine_1.SQLCAMMAND.GETMSGTYPEBYHASH), hash, (err, row) => {\n                if (err) {\n                    reject(err);\n                }\n                else {\n                    resolve(row);\n                }\n            });\n        });\n    }\n    /**获取文件名到hash名的映射 */\n    static getFileName2HashNameMap() {\n        if (!this.dbIsOpen)\n            return Promise.resolve(new Map());\n        return new Promise((resolve, reject) => {\n            this.db.all(this.getSqlCommand(ServerDefine_1.SQLCAMMAND.GETFILENAME2HASHNAMEMAP), (err, rows) => {\n                if (err) {\n                    reject(err);\n                }\n                else {\n                    const map = new Map();\n                    for (const row of rows) {\n                        map.set(row.fileName, row.originalname);\n                    }\n                    resolve(map);\n                }\n            });\n        });\n    }\n    /**获取sql语句 */\n    static getSqlCommand(cammand, tableName) {\n        tableName = tableName ? tableName : this.tableName;\n        switch (cammand) {\n            case ServerDefine_1.SQLCAMMAND.CREATETABLE:\n                return `CREATE TABLE IF NOT EXISTS ${tableName} (fileName TEXT, fileOrTextHash TEXT, timestamp INTEGER, text TEXT, msgType TEXT,url TEXT,size INTEGER,originalname TEXT)`;\n            case ServerDefine_1.SQLCAMMAND.WRITETODATABASE:\n                return `INSERT INTO ${tableName} (fileName, fileOrTextHash, timestamp, text, msgType, url ,size,originalname) VALUES (?, ?, ?, ?, ? ,? ,?,?)`;\n            case ServerDefine_1.SQLCAMMAND.DELETEFROMDATABASE:\n                return `DELETE FROM ${tableName} WHERE fileOrTextHash = ?`;\n            case ServerDefine_1.SQLCAMMAND.GETALLMSGS:\n                return `SELECT * FROM ${tableName}`;\n            case ServerDefine_1.SQLCAMMAND.GETALLFILEORTEXTHASHES:\n                return `SELECT fileOrTextHash FROM ${tableName}`;\n            case ServerDefine_1.SQLCAMMAND.GETMSGTYPEBYHASH:\n                return `SELECT * FROM ${tableName} WHERE fileOrTextHash = ?`;\n            case ServerDefine_1.SQLCAMMAND.GETFILENAME2HASHNAMEMAP:\n                return `SELECT fileName, originalname FROM ${tableName} WHERE msgType = 'file'`;\n            case ServerDefine_1.SQLCAMMAND.GETALLFILEHASHES:\n                return `SELECT * FROM ${tableName} WHERE msgType = 'file'`;\n            default:\n                return \"\";\n        }\n    }\n}\nexports.DatabaseOperation = DatabaseOperation;\nDatabaseOperation.tableName = \"\";\nDatabaseOperation.dbIsOpen = false;\nDatabaseOperation.dbExists = false;\n\n\n//# sourceURL=webpack://file-sync/./src/server/DatabaseOperation.ts?");

/***/ }),

/***/ "./src/server/FileOperation.ts":
/*!*************************************!*\
  !*** ./src/server/FileOperation.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.FileOperation = void 0;\nconst fs_1 = __importDefault(__webpack_require__(/*! fs */ \"fs\"));\nconst Utils_1 = __webpack_require__(/*! ./Utils */ \"./src/server/Utils.ts\");\nclass FileOperation {\n    /**删除文件 */\n    static deleteFile(filePath) {\n        return __awaiter(this, void 0, void 0, function* () {\n            filePath = Utils_1.Utils.getRelativePath(filePath);\n            //判断文件是否存在\n            if (!filePath || !fs_1.default.existsSync(filePath)) {\n                console.log('文件不存在' + filePath);\n            }\n            else {\n                fs_1.default.unlink(filePath, (err) => {\n                    if (err) {\n                        console.log('删除文件失败' + err);\n                    }\n                    else {\n                        // console.log('删除文件成功' + filePath);\n                    }\n                });\n            }\n        });\n    }\n}\nexports.FileOperation = FileOperation;\n\n\n//# sourceURL=webpack://file-sync/./src/server/FileOperation.ts?");

/***/ }),

/***/ "./src/server/HttpServer.ts":
/*!**********************************!*\
  !*** ./src/server/HttpServer.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.HttpServer = void 0;\nconst compression_1 = __importDefault(__webpack_require__(/*! compression */ \"compression\"));\nconst crypto_1 = __importDefault(__webpack_require__(/*! crypto */ \"crypto\"));\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst fs_1 = __importDefault(__webpack_require__(/*! fs */ \"fs\"));\nconst http_1 = __importDefault(__webpack_require__(/*! http */ \"http\"));\nconst multer_1 = __importDefault(__webpack_require__(/*! multer */ \"multer\"));\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\nconst ProjectConfig_1 = __webpack_require__(/*! ../ProjectConfig */ \"./src/ProjectConfig.ts\");\nconst EventMgr_1 = __webpack_require__(/*! ../common/EventMgr */ \"./src/common/EventMgr.ts\");\nconst DatabaseOperation_1 = __webpack_require__(/*! ./DatabaseOperation */ \"./src/server/DatabaseOperation.ts\");\nconst ServerConfig_1 = __webpack_require__(/*! ./ServerConfig */ \"./src/server/ServerConfig.ts\");\nconst ServerDefine_1 = __webpack_require__(/*! ./ServerDefine */ \"./src/server/ServerDefine.ts\");\nconst Utils_1 = __webpack_require__(/*! ./Utils */ \"./src/server/Utils.ts\");\nclass HttpServer {\n    /**开启服务器 */\n    static startServer(port) {\n        return __awaiter(this, void 0, void 0, function* () {\n            yield DatabaseOperation_1.DatabaseOperation.getFileName2HashNameMap().then((map) => {\n                this.fileName2HashNameMap = map;\n                this.hashName2FileNameMap = new Map();\n                if (this.fileName2HashNameMap) {\n                    this.fileName2HashNameMap.forEach((value, key) => {\n                        this.hashName2FileNameMap.set(value, key);\n                    });\n                }\n            });\n            yield DatabaseOperation_1.DatabaseOperation.getFileHashAndFileNameMap().then((map) => {\n                this.hash2FileNameMap = map;\n            });\n            yield new Promise((resolve, reject) => {\n                this.savePath = Utils_1.Utils.getRelativePath(ServerConfig_1.ServerConfig.uploadFileSavePath);\n                this.toolPath = Utils_1.Utils.getRelativePath(ServerConfig_1.ServerConfig.toolPath);\n                this.initServer();\n                resolve(this.startHttpServer(this.server, port));\n            });\n        });\n    }\n    /**初始化服务器框架 */\n    static initServer() {\n        Utils_1.Utils.checkDirExist(this.savePath);\n        this.appExpress = (0, express_1.default)();\n        this.appExpress.use((0, compression_1.default)()); //开启gzip压缩\n        this.server = http_1.default.createServer(this.appExpress);\n        this.storageEngine = multer_1.default.diskStorage({\n            destination: (req, file, cb) => {\n                cb(null, this.savePath);\n            },\n            filename: (req, file, cb) => {\n                let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);\n                cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));\n            }\n        });\n        this.uploadMulter = (0, multer_1.default)({ storage: this.storageEngine });\n    }\n    /**开启http服务器 */\n    static startHttpServer(server, port) {\n        return __awaiter(this, void 0, void 0, function* () {\n            yield new Promise((resolve, reject) => {\n                server.listen(port)\n                    .on('listening', () => {\n                    this.addEvent();\n                    this.initHttpServerApi();\n                    console.log(\"http服务器已启动：\");\n                    console.log(`http://${ServerConfig_1.ServerConfig.serverIp}:${ServerConfig_1.ServerConfig.httpPort}`);\n                    resolve(null);\n                })\n                    .on('error', (err) => {\n                    if (err.code === 'EADDRINUSE') {\n                        console.warn(`http服务器请求的端口${port}已被占用，尝试使用端口${port + 10}`);\n                        server.removeAllListeners('listening');\n                        server.removeAllListeners('error');\n                        ServerConfig_1.ServerConfig.httpPort = port + 10;\n                        resolve(this.startHttpServer(server, port + 10));\n                    }\n                    else {\n                        reject(err);\n                        console.error(err);\n                    }\n                });\n            });\n        });\n    }\n    /**添加监听 */\n    static addEvent() {\n        EventMgr_1.EventMgr.on(ServerDefine_1.EventName.DELETEITEM, this.deleteFileOrText, this);\n    }\n    /**移除监听 */\n    static removeEvent() {\n        EventMgr_1.EventMgr.off(ServerDefine_1.EventName.DELETEITEM, this.deleteFileOrText, this);\n    }\n    /**删除文件或文本 */\n    static deleteFileOrText(fileOrTextHash) {\n        if (this.hash2FileNameMap) {\n            this.hash2FileNameMap.delete(fileOrTextHash);\n        }\n        if (this.fileName2HashNameMap) {\n            let fileName = this.hashName2FileNameMap.get(fileOrTextHash);\n            if (fileName) {\n                this.fileName2HashNameMap.delete(fileName);\n            }\n            this.hashName2FileNameMap.delete(fileOrTextHash);\n        }\n    }\n    /**初始化http服务器api */\n    static initHttpServerApi() {\n        this.initUploadApi();\n        this.initGetSocketInfoApi();\n        this.initGetWebFileApi();\n        this.initGetUploadFileApi();\n        this.initGetToolApi();\n    }\n    /**初始化上传api */\n    static initUploadApi() {\n        this.appExpress.post('/upload', this.uploadMulter.single('file'), (req, res, next) => {\n            if (!req.file && !req.body.text) {\n                return next(new Error('文件为空'));\n            }\n            this.onFileUpload(req, res, next);\n            this.onTextUpload(req, res, next);\n        }, (err, req, res, next) => {\n            res.status(500).send(err.message);\n        });\n    }\n    /**文件上传 */\n    static onFileUpload(req, res, next) {\n        if (req.file) {\n            let self = this;\n            const hash = crypto_1.default.createHash('md5');\n            const stream = fs_1.default.createReadStream(req.file.path);\n            stream.on('data', (data) => hash.update(data));\n            stream.on('end', () => {\n                const fileHash = hash.digest('hex');\n                req.file.originalname = Buffer.from(req.file.originalname, \"latin1\").toString('utf8');\n                if (this.hash2FileNameMap.get(fileHash)) {\n                    let name = self.hash2FileNameMap.get(fileHash);\n                    if (!res.headersSent) {\n                        return res.status(409).send('文件已存在：' + name);\n                    }\n                }\n                let savePath = `${ServerConfig_1.ServerConfig.uploadFileSavePath}/${req.file.filename}`;\n                const msg = {\n                    msgType: \"file\",\n                    fileOrTextHash: fileHash,\n                    timestamp: Date.now(),\n                    fileName: Utils_1.Utils.decodeMimeEncodedString(req.file.originalname),\n                    url: savePath,\n                    size: (req.file.size / 1024) > 0 ? (req.file.size / 1024) : 0,\n                    hashName: req.file.filename\n                };\n                DatabaseOperation_1.DatabaseOperation.writeToDatabase(msg).then(() => {\n                    if (!res.headersSent) {\n                        res.send('文件上传成功');\n                    }\n                    EventMgr_1.EventMgr.emit(ServerDefine_1.EventName.ONMESSAGESAVED, msg);\n                    this.hash2FileNameMap.set(fileHash, req.file.originalname);\n                    this.fileName2HashNameMap.set(req.file.originalname, req.file.filename);\n                    this.hashName2FileNameMap.set(req.file.filename, req.file.originalname);\n                }).catch((err) => {\n                    console.error(err);\n                    if (!res.headersSent) {\n                        res.status(500).send(\"数据库写入失败\");\n                    }\n                });\n            });\n        }\n    }\n    /**文本上传 */\n    static onTextUpload(req, res, next) {\n        if (req.body.text) {\n            const text = req.body.text;\n            const textHash = crypto_1.default.createHash('md5').update(text + Date.now() + '-' + Math.round(Math.random() * 1E9)).digest('hex');\n            let msg = {\n                msgType: \"text\",\n                fileOrTextHash: textHash,\n                timestamp: Date.now(),\n                text: text,\n                size: 0,\n                hashName: \"\"\n            };\n            DatabaseOperation_1.DatabaseOperation.writeToDatabase(msg).then(() => {\n                EventMgr_1.EventMgr.emit(ServerDefine_1.EventName.ONMESSAGESAVED, msg);\n                if (!res.headersSent) {\n                    res.send('已发送');\n                }\n            }).catch((err) => {\n                console.error(err);\n                if (!res.headersSent) {\n                    res.status(500).send(\"数据库写入失败\");\n                }\n            });\n        }\n    }\n    /**获取socket服务器信息 */\n    static initGetSocketInfoApi() {\n        this.appExpress.get('/getSocketInfo', (req, res) => {\n            const socketInfo = {\n                socketServerURL: ServerConfig_1.ServerConfig.serverIp,\n                socketPort: ServerConfig_1.ServerConfig.socketPort,\n                projectName: ProjectConfig_1.ProjectConfig.projectName,\n                author: ProjectConfig_1.ProjectConfig.author,\n                description: ProjectConfig_1.ProjectConfig.description,\n                version: ProjectConfig_1.ProjectConfig.versionStr,\n            };\n            res.send(socketInfo);\n        });\n    }\n    /**获取web文件 */\n    static initGetWebFileApi() {\n        for (let key in ServerConfig_1.ServerConfig.httpFileMap) {\n            this.appExpress.get(key, (req, res) => {\n                const filePath = path_1.default.join(__dirname, '../client/' + ServerConfig_1.ServerConfig.httpFileMap[key]);\n                res.sendFile(filePath, (err) => {\n                    if (err) {\n                        let msg = `File not found1: ${ServerConfig_1.ServerConfig.httpFileMap[key]}`;\n                        console.log(msg);\n                        if (!res.headersSent) {\n                            res.status(404).send(msg);\n                        }\n                    }\n                });\n            });\n        }\n        this.appExpress.get('/:file', (req, res) => {\n            const filePath = path_1.default.join(__dirname, '../client/', req.params.file);\n            res.sendFile(filePath, (err) => {\n                if (err) {\n                    let msg = `File not found: ${req.params.file}`;\n                    console.log(msg);\n                    if (!res.headersSent) {\n                        res.status(404).send(msg);\n                    }\n                }\n            });\n        });\n    }\n    /**获取上传文件 */\n    static initGetUploadFileApi() {\n        let self = this;\n        this.appExpress.get('/uploadFile/:filename', (req, res) => {\n            const file = `${self.savePath}/${req.params.filename}`;\n            const fileName = self.hashName2FileNameMap.get(req.params.filename);\n            res.download(file, fileName, (err) => {\n                if (err) {\n                    console.error(err);\n                    if (!res.headersSent) {\n                        res.status(500).send(\"文件下载失败\");\n                    }\n                }\n            });\n        });\n    }\n    /**获取桌面快捷工具 */\n    static initGetToolApi() {\n        let self = this;\n        this.appExpress.get('/tool/:filename', (req, res) => {\n            res.download(path_1.default.join(__dirname, '../tool/' + req.params.filename), req.params.filename, (err) => {\n                if (err) {\n                    console.error(err);\n                    if (!res.headersSent) {\n                        res.status(500).send(\"工具下载失败\");\n                    }\n                }\n            });\n        });\n    }\n}\nexports.HttpServer = HttpServer;\nHttpServer.savePath = \"\";\nHttpServer.toolPath = \"\";\n\n\n//# sourceURL=webpack://file-sync/./src/server/HttpServer.ts?");

/***/ }),

/***/ "./src/server/ServerConfig.ts":
/*!************************************!*\
  !*** ./src/server/ServerConfig.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ServerConfig = void 0;\nclass ServerConfig {\n    /**服务器配置 */\n    static get serverConfig() {\n        return {\n            \"ps1\": \"此处为端口以及IP配置，默认http服务器4100，socket服务器4200\",\n            \"ps2\": \"如果你要修改，请修改下面的端口号之后重启服务器\",\n            \"ps3\": \"如果端口冲突，默认+10直到找到空闲端口\",\n            \"ps4\": \"如果IP获取不对，请修改下面的IP地址\",\n            \"httpPort\": this.httpPort,\n            \"socketPort\": this.socketPort,\n            \"serverIp\": this.serverIp\n        };\n    }\n    /**初次启动服务器欢迎信息 */\n    static get welcomeMsg() {\n        return {\n            msgType: 'text',\n            fileOrTextHash: '850f3be40c4b93f7dd0910942d1e5a23',\n            timestamp: Date.now(),\n            text: '是信息，好耶！<copyright by NoRain>',\n            size: 0\n        };\n    }\n}\nexports.ServerConfig = ServerConfig;\n/**服务器的URL 默认socket和http同一个 */\nServerConfig.serverIp = '127.0.0.1';\n/**http 服务器的端口号 注意，如果端口被占用，会自动加10直到找到空闲端口 */\nServerConfig.httpPort = 4100;\n/**socket 服务器的端口号 注意，如果端口被占用，会自动加10直到找到空闲端口 */\nServerConfig.socketPort = 4200;\n/**上传文件保存路径 */\nServerConfig.uploadFileSavePath = '../uploadFile';\n/**工具路径 */\nServerConfig.toolPath = '../tool';\n/**服务器数据保存路径 */\nServerConfig.sqlDbPath = '../fsDatabase.sqlite';\n/**默认数据表名字 */\nServerConfig.tableName = 'fsTable';\n/**服务器文件映射 */\nServerConfig.httpFileMap = {\n    \"/\": \"index.html\"\n};\n/**服务器配置文件路径 */\nServerConfig.serverConfigPath = \"../serverConfig.json\";\n\n\n//# sourceURL=webpack://file-sync/./src/server/ServerConfig.ts?");

/***/ }),

/***/ "./src/server/ServerConfigMgr.ts":
/*!***************************************!*\
  !*** ./src/server/ServerConfigMgr.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ServerConfigMgr = void 0;\nconst fs_1 = __importDefault(__webpack_require__(/*! fs */ \"fs\"));\nconst ServerConfig_1 = __webpack_require__(/*! ./ServerConfig */ \"./src/server/ServerConfig.ts\");\nconst Utils_1 = __webpack_require__(/*! ./Utils */ \"./src/server/Utils.ts\");\nclass ServerConfigMgr {\n    /**读取本地配置 */\n    static readConfig(configPath) {\n        configPath = Utils_1.Utils.getRelativePath(configPath);\n        if (fs_1.default.existsSync(configPath)) {\n            try {\n                let serverConfig = JSON.parse(fs_1.default.readFileSync(configPath, 'utf-8'));\n                ServerConfig_1.ServerConfig.httpPort = serverConfig.httpPort;\n                ServerConfig_1.ServerConfig.socketPort = serverConfig.socketPort;\n                ServerConfig_1.ServerConfig.serverIp = serverConfig.serverIp;\n                console.log(\"配置文件读取成功\");\n            }\n            catch (e) {\n                console.warn(e);\n            }\n        }\n        else {\n            console.warn(\"未找到配置文件，将使用默认配置\");\n        }\n    }\n    /**写入本地配置 */\n    static writeConfig(configPath) {\n        configPath = Utils_1.Utils.getRelativePath(configPath);\n        fs_1.default.writeFileSync(configPath, JSON.stringify(ServerConfig_1.ServerConfig.serverConfig, null, 2));\n    }\n}\nexports.ServerConfigMgr = ServerConfigMgr;\n\n\n//# sourceURL=webpack://file-sync/./src/server/ServerConfigMgr.ts?");

/***/ }),

/***/ "./src/server/ServerDefine.ts":
/*!************************************!*\
  !*** ./src/server/ServerDefine.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.EventName = exports.SQLCAMMAND = void 0;\nvar SQLCAMMAND;\n(function (SQLCAMMAND) {\n    SQLCAMMAND[SQLCAMMAND[\"CREATETABLE\"] = 0] = \"CREATETABLE\";\n    SQLCAMMAND[SQLCAMMAND[\"WRITETODATABASE\"] = 1] = \"WRITETODATABASE\";\n    SQLCAMMAND[SQLCAMMAND[\"DELETEFROMDATABASE\"] = 2] = \"DELETEFROMDATABASE\";\n    SQLCAMMAND[SQLCAMMAND[\"GETALLMSGS\"] = 3] = \"GETALLMSGS\";\n    SQLCAMMAND[SQLCAMMAND[\"GETALLFILEORTEXTHASHES\"] = 4] = \"GETALLFILEORTEXTHASHES\";\n    SQLCAMMAND[SQLCAMMAND[\"GETMSGTYPEBYHASH\"] = 5] = \"GETMSGTYPEBYHASH\";\n    SQLCAMMAND[SQLCAMMAND[\"GETFILENAME2HASHNAMEMAP\"] = 6] = \"GETFILENAME2HASHNAMEMAP\";\n    SQLCAMMAND[SQLCAMMAND[\"GETALLFILEHASHES\"] = 7] = \"GETALLFILEHASHES\";\n})(SQLCAMMAND || (exports.SQLCAMMAND = SQLCAMMAND = {}));\nvar EventName;\n(function (EventName) {\n    EventName[\"ONMESSAGESAVED\"] = \"ONMESSAGESAVED\";\n    EventName[\"DELETEITEM\"] = \"DELETEITEM\";\n})(EventName || (exports.EventName = EventName = {}));\n\n\n//# sourceURL=webpack://file-sync/./src/server/ServerDefine.ts?");

/***/ }),

/***/ "./src/server/SocketServer.ts":
/*!************************************!*\
  !*** ./src/server/SocketServer.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.SocketServer = void 0;\nconst net = __importStar(__webpack_require__(/*! net */ \"net\"));\nconst ws_1 = __webpack_require__(/*! ws */ \"ws\");\nconst CommonDefine_1 = __webpack_require__(/*! ../common/CommonDefine */ \"./src/common/CommonDefine.ts\");\nconst EventMgr_1 = __webpack_require__(/*! ../common/EventMgr */ \"./src/common/EventMgr.ts\");\nconst DatabaseOperation_1 = __webpack_require__(/*! ./DatabaseOperation */ \"./src/server/DatabaseOperation.ts\");\nconst FileOperation_1 = __webpack_require__(/*! ./FileOperation */ \"./src/server/FileOperation.ts\");\nconst ServerConfig_1 = __webpack_require__(/*! ./ServerConfig */ \"./src/server/ServerConfig.ts\");\nconst ServerDefine_1 = __webpack_require__(/*! ./ServerDefine */ \"./src/server/ServerDefine.ts\");\nclass SocketServer {\n    /**开启服务器 */\n    static startServer(port) {\n        return __awaiter(this, void 0, void 0, function* () {\n            yield new Promise((resolve, reject) => {\n                this.server = net.createServer();\n                this.server.once('error', (err) => {\n                    if (err.code === 'EADDRINUSE') {\n                        console.log(`端口${port}已被占用，尝试使用端口${port + 10}`);\n                        resolve(SocketServer.startServer(port + 10));\n                    }\n                    else {\n                        console.error(err);\n                    }\n                });\n                this.server.once('listening', this.initSocketServer.bind(this, port, resolve));\n                this.server.listen(port);\n            });\n        });\n    }\n    /**关闭socket服务器 */\n    static closeSocketServer() {\n        var _a;\n        this.removeEvent();\n        if (this.wss) {\n            for (let i of this.wss.clients) {\n                i.off(\"close\", this.onWsClose.bind(this));\n                i.off(\"message\", this.onWsMsg.bind(this, i));\n                i.off(\"error\", this.onWsError.bind(this));\n                i.close();\n            }\n        }\n        (_a = this.wss) === null || _a === void 0 ? void 0 : _a.close();\n    }\n    /**初始化socket服务器 */\n    static initSocketServer(port, resolve) {\n        var _a;\n        (_a = this.server) === null || _a === void 0 ? void 0 : _a.close();\n        this.server = null;\n        if (!port || typeof port !== 'number') {\n            throw new Error('端口号必须是数字');\n        }\n        this.wss = new ws_1.WebSocketServer({ port: port });\n        ServerConfig_1.ServerConfig.socketPort = port;\n        this._lastMsgChangeTimestamp = Date.now();\n        this.addEvent();\n        resolve();\n        console.log(\"socket服务器已启动：\");\n        console.log(`ws://${ServerConfig_1.ServerConfig.serverIp}:${port}`);\n    }\n    /**添加监听 */\n    static addEvent() {\n        this.wss.on('connection', this.onSocketConnection.bind(this));\n        EventMgr_1.EventMgr.on(ServerDefine_1.EventName.ONMESSAGESAVED, this.onMessageSaved, this);\n    }\n    /**移除监听 */\n    static removeEvent() {\n        var _a;\n        (_a = this.wss) === null || _a === void 0 ? void 0 : _a.off('connection', this.onSocketConnection);\n        EventMgr_1.EventMgr.off(ServerDefine_1.EventName.ONMESSAGESAVED, this.onMessageSaved, this);\n    }\n    /**消息保存 */\n    static onMessageSaved(msg) {\n        let data = { msg: msg };\n        this._lastMsgChangeTimestamp = Date.now();\n        let socketMsg = { operate: CommonDefine_1.ServerClientOperate.ADD, timeStamp: this._lastMsgChangeTimestamp, data: data };\n        let str = JSON.stringify(socketMsg);\n        this.wss.clients.forEach((client) => {\n            client.send(str);\n        });\n    }\n    /**socket连接 */\n    static onSocketConnection(ws) {\n        ws.on('close', this.onWsClose.bind(this));\n        ws.on('message', this.onWsMsg.bind(this, ws));\n        ws.on('error', this.onWsError.bind(this));\n    }\n    /**socket关闭 */\n    static onWsClose() {\n        // console.log('用户断开连接');\n    }\n    /**socket错误 */\n    static onWsError(err) {\n        console.warn(err);\n    }\n    /**socket消息 */\n    static onWsMsg(ws, msg) {\n        let socketMsg = JSON.parse(msg);\n        switch (socketMsg.operate) {\n            case CommonDefine_1.ServerClientOperate.HEARTBEAT:\n                let heartBeat = { operate: CommonDefine_1.ServerClientOperate.HEARTBEAT, timeStamp: this._lastMsgChangeTimestamp };\n                ws.send(JSON.stringify(heartBeat));\n                break;\n            case CommonDefine_1.ServerClientOperate.DELETE:\n                let fileOrTextHash = socketMsg.data.fileOrTextHash;\n                DatabaseOperation_1.DatabaseOperation.getMsgDataByHash(fileOrTextHash).then((deleteMsg) => {\n                    if (deleteMsg != null && deleteMsg.msgType != null) { //防止重复删除\n                        if (deleteMsg.msgType === 'file') {\n                            FileOperation_1.FileOperation.deleteFile(deleteMsg.url);\n                        }\n                        DatabaseOperation_1.DatabaseOperation.deleteFromDatabase(fileOrTextHash).then(() => {\n                            EventMgr_1.EventMgr.emit(ServerDefine_1.EventName.DELETEITEM, fileOrTextHash);\n                            this._lastMsgChangeTimestamp = Date.now();\n                            let data = { fileOrTextHash: fileOrTextHash };\n                            let socketMsg = { operate: CommonDefine_1.ServerClientOperate.DELETE, timeStamp: this._lastMsgChangeTimestamp, data: data };\n                            let str = JSON.stringify(socketMsg);\n                            this.wss.clients.forEach((client) => {\n                                client.send(str);\n                            });\n                        });\n                    }\n                });\n                break;\n            case CommonDefine_1.ServerClientOperate.FULL:\n                DatabaseOperation_1.DatabaseOperation.getAllMsgs().then((msgs) => {\n                    let data = { msgs: msgs };\n                    let socketMsg = { operate: CommonDefine_1.ServerClientOperate.FULL, timeStamp: this._lastMsgChangeTimestamp, data: data };\n                    ws.send(JSON.stringify(socketMsg));\n                });\n                break;\n            case CommonDefine_1.ServerClientOperate.REFRESH:\n                let data = { operate: CommonDefine_1.ServerClientOperate.REFRESH, timeStamp: this._lastMsgChangeTimestamp };\n                ws.send(JSON.stringify(data));\n                break;\n            default:\n                let msg = \"未知的operate:\" + socketMsg.operate;\n                let errData = { error: msg };\n                let err = { operate: CommonDefine_1.ServerClientOperate.ERROR, timeStamp: this._lastMsgChangeTimestamp, data: errData };\n                ws.send(JSON.stringify(err));\n                break;\n        }\n    }\n}\nexports.SocketServer = SocketServer;\nSocketServer._lastMsgChangeTimestamp = 0;\n\n\n//# sourceURL=webpack://file-sync/./src/server/SocketServer.ts?");

/***/ }),

/***/ "./src/server/Utils.ts":
/*!*****************************!*\
  !*** ./src/server/Utils.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Utils = void 0;\nconst child_process_1 = __webpack_require__(/*! child_process */ \"child_process\");\nconst fs_1 = __importDefault(__webpack_require__(/*! fs */ \"fs\"));\nconst os = __importStar(__webpack_require__(/*! os */ \"os\"));\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\nclass Utils {\n    /**获取本机IP */\n    static getLocalIP() {\n        const interfaces = os.networkInterfaces();\n        const virtualInterfaceKeywords = ['Virtual', 'VMware', 'vEthernet'];\n        for (let devName in interfaces) {\n            // 过滤掉虚拟网卡\n            if (virtualInterfaceKeywords.some(keyword => devName.includes(keyword))) {\n                continue;\n            }\n            let iface = interfaces[devName];\n            for (let i = 0; i < iface.length; i++) {\n                let alias = iface[i];\n                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {\n                    return alias.address;\n                }\n            }\n        }\n        console.warn(\"无法获取本机IP地址，将使用默认地址\");\n        return '127.0.0.1';\n    }\n    /**检查目录是否存在,不存在就创建 */\n    static checkDirExist(path) {\n        if (!fs_1.default.existsSync(path)) {\n            fs_1.default.mkdirSync(path);\n        }\n    }\n    /**获取相对代码运行的路径 */\n    static getRelativePath(sourcePath, extraPath = \"\") {\n        if (process.pkg) {\n            return path_1.default.join(process.cwd(), sourcePath.substring(1)); //因为打包之后执行路径会变成相对.exe文件的路径，所以需要减少一位 \".\"。\n        }\n        else {\n            return path_1.default.join(__dirname, extraPath, sourcePath);\n        }\n    }\n    /**打开浏览器 */\n    static openBrowser(url) {\n        switch (process.platform) {\n            case \"win32\":\n                (0, child_process_1.exec)(`start ${url}`);\n                break;\n            case \"darwin\":\n                (0, child_process_1.exec)(`open ${url}`);\n                break;\n            default:\n                (0, child_process_1.exec)(`xdg-open ${url}`);\n        }\n    }\n    /**处理base64的编码格式 */\n    static decodeMimeEncodedString(encodedString) {\n        const mimePattern = /=\\?([^?]+)\\?([BQ])\\?([^?]+)\\?=/i;\n        const matches = mimePattern.exec(encodedString);\n        if (!matches) {\n            return encodedString;\n        }\n        const charset = matches[1];\n        const encoding = matches[2].toUpperCase();\n        const encodedText = matches[3];\n        let decodedText;\n        if (encoding === 'B') {\n            decodedText = Buffer.from(encodedText, 'base64').toString(charset);\n        }\n        else if (encoding === 'Q') {\n            decodedText = encodedText.replace(/_/g, ' ').replace(/=([A-Fa-f0-9]{2})/g, (match, hex) => {\n                return String.fromCharCode(parseInt(hex, 16));\n            });\n        }\n        else {\n            decodedText = encodedString;\n        }\n        return decodedText;\n    }\n}\nexports.Utils = Utils;\n\n\n//# sourceURL=webpack://file-sync/./src/server/Utils.ts?");

/***/ }),

/***/ "./src/server/index.ts":
/*!*****************************!*\
  !*** ./src/server/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst DatabaseOperation_1 = __webpack_require__(/*! ./DatabaseOperation */ \"./src/server/DatabaseOperation.ts\");\nconst HttpServer_1 = __webpack_require__(/*! ./HttpServer */ \"./src/server/HttpServer.ts\");\nconst ServerConfig_1 = __webpack_require__(/*! ./ServerConfig */ \"./src/server/ServerConfig.ts\");\nconst ServerConfigMgr_1 = __webpack_require__(/*! ./ServerConfigMgr */ \"./src/server/ServerConfigMgr.ts\");\nconst SocketServer_1 = __webpack_require__(/*! ./SocketServer */ \"./src/server/SocketServer.ts\");\nconst Utils_1 = __webpack_require__(/*! ./Utils */ \"./src/server/Utils.ts\");\n/**主入口类 */\nclass index {\n    constructor() {\n        this.init();\n    }\n    init() {\n        return __awaiter(this, void 0, void 0, function* () {\n            ServerConfig_1.ServerConfig.serverIp = Utils_1.Utils.getLocalIP();\n            ServerConfigMgr_1.ServerConfigMgr.readConfig(ServerConfig_1.ServerConfig.serverConfigPath);\n            yield DatabaseOperation_1.DatabaseOperation.openDatabase(ServerConfig_1.ServerConfig.sqlDbPath, ServerConfig_1.ServerConfig.tableName);\n            yield SocketServer_1.SocketServer.startServer(ServerConfig_1.ServerConfig.socketPort);\n            yield HttpServer_1.HttpServer.startServer(ServerConfig_1.ServerConfig.httpPort);\n            yield ServerConfigMgr_1.ServerConfigMgr.writeConfig(ServerConfig_1.ServerConfig.serverConfigPath);\n            Utils_1.Utils.openBrowser(`http://${ServerConfig_1.ServerConfig.serverIp}:${ServerConfig_1.ServerConfig.httpPort}`);\n        });\n    }\n}\nexports[\"default\"] = index;\nnew index();\n\n\n//# sourceURL=webpack://file-sync/./src/server/index.ts?");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("compression");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("multer");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "sqlite3":
/*!**************************!*\
  !*** external "sqlite3" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("sqlite3");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("ws");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server/index.ts");
/******/ 	
/******/ })()
;