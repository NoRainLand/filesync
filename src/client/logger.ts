import { ProjectConfig } from "../ProjectConfig";

export class Logger {
    private static sLog: Function;
    private static iLog: Function;
    private static wLog: Function;
    private static eLog: Function;
    static tranLogger() {
        if (ProjectConfig.closeLog) {
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
        if (ProjectConfig.closeLog) {
            this.sLog(...args);
        } else {
            console.log(...args);
        }
    }

    static info(...args: any[]) {
        if (ProjectConfig.closeLog) {
            this.iLog(...args);
        } else {
            console.info(...args);
        }
    }

    static warn(...args: any[]) {
        if (ProjectConfig.closeLog) {
            this.wLog(...args);
        } else {
            console.warn(...args);
        }
    }

    static error(...args: any[]) {
        if (ProjectConfig.closeLog) {
            this.eLog(...args);
        } else {
            console.error(...args);
        }
    }
}