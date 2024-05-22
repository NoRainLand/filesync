import { Config } from "../config/Config";

export class NetHttp {
    getSocketInfo<T>(): Promise<T> {
        return fetch(Config.httpApiMap.getSocketInfo)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            });
    }

    uploadMsg(formData: FormData, onprogress: (event: ProgressEvent) => void): Promise<string> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', Config.httpApiMap.upload, true);
            xhr.upload.onprogress = onprogress;
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.response);
                }
            };
            xhr.onerror = () => {
                reject("上传失败，请检查网络连接");
            };
            xhr.send(formData);
        });
    }
}