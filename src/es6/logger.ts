import { config } from "./config";

export class logger {
    static tranLogger() {
        if (!config.isDebug) {
            console.log = function () { };
            console.info = function () { };
            console.warn = function () { };
            console.error = function () { };
        }
    }
}