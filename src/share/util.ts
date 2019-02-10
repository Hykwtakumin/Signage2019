import axios, {AxiosResponse} from "axios";
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

/*メールを送る関数*/
const sendMail = async (to: string, subject: string, body: string) : Promise<boolean> => {
    return new Promise((resolve, reject) => {
        axios.post("http://192.168.0.200/mail",
            {
                to: to,
                subject: subject,
                body: body
            })
            .then( response => {
                if (response.status === 200) {
                    resolve(true);
                } else {
                    reject(false);
                }
            })
            .catch( error => {
                console.error(error);
                reject(error);
            })
    });
};

/*利用者のkeywordsと店のkeywordsとの間で共通するものを返す関数*/
const isKeyWordContained = async (userWords: Array<string>, shopWords: Array<string>): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        userWords.forEach(word => {
            if (shopWords && shopWords.includes(word)) {
                resolve(true);
            }
        });
    });
};

export const client = axios.create({
    //baseURL: "http://192.168.0.200/",
    // baseURL: "http://connectouch.org/",
    timeout: 5000,
    withCredentials: false,
    validateStatus: _ => true,
    headers: {
        // Accept: "application/text/plain",
        // "Content-Type": "application/text/plain",
        "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Headers":"Content-Type",
        // "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
    }
});

export function get(url: string, Params: any): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>((resolve, reject) => {
        client
            .get(url, { params: Params })
            .then(response => {
                resolve(response);
            })
            .catch(response => {
                reject(response);
            });
    });
}

export function post(url: string, Params: any): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>((resolve, reject) => {
        client
            .post(url, { params: Params })
            .then(response => {
                resolve(response);
            })
            .catch(response => {
                reject(response);
            });
    });
}

export function put(url: string, Params: any): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>((resolve, reject) => {
        client
            .put(url, { params: Params })
            .then(response => {
                resolve(response);
            })
            .catch(response => {
                reject(response);
            });
    });
}

export function delete_req(url: string, Params: any): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>((resolve, reject) => {
        client
            .delete(url, { params: Params })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}



export { sendMail, isKeyWordContained }