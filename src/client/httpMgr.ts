import { Config } from "./Config";

export class HttpMgr {
    static getSocketInfo<T>(): Promise<T> {
        return fetch(Config.httpApiMap.getSocketInfo)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            });
    }

    static uploadMsg(formData: FormData, onprogress: (event: ProgressEvent) => {}): Promise<string> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', Config.httpApiMap.upload, true);
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