import { config } from "./config";

export class logger {
    private static sLog: Function;
    private static iLog: Function;
    private static wLog: Function;
    private static eLog: Function;
    static tranLogger() {
        if (!config.isDebug) {
            this.sLog = console.log;
            this.iLog = console.info;
            this.wLog = console.warn;
            this.eLog = console.error;
            console.log = function () { };
            console.info = function () { };
            console.warn = function () { };
            console.error = function () { };
        }
    }
    static log(...args: any[]) {
        if (!config.isDebug) {
            this.sLog(...args);
        } else {
            console.log(...args);
        }
    }
}