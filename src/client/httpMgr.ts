import { config } from "./config";

export class httpMgr {
    constructor() {

    }
    static getSocketInfo<T>(): Promise<T> {
        return fetch(config.httpApi.getSocketInfo)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            });
    }

    static sendMsg(formData: FormData): Promise<string> {
        return fetch(config.httpApi.upload, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.text();
            })
    }
}