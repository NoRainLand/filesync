export class myHttp {
    constructor() {

    }
    static getSocketInfo<T>(): Promise<T> {
        return fetch('/getSocketInfo')
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            });
    }

    static sendMsg(formData: FormData): Promise<string> {
        return fetch('/upload', {
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