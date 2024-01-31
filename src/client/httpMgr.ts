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

    static sendMsg(formData: FormData, onprogress: (event: ProgressEvent) => {}): Promise<string> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', config.httpApi.upload, true);

            xhr.upload.onprogress = onprogress;

            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(new Error(xhr.statusText));
                }
            };

            xhr.onerror = function () {
                reject(new Error('An error occurred while uploading the file.'));
            };

            xhr.send(formData);
        });
    }
}