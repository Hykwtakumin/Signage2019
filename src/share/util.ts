import axios, {AxiosResponse} from "axios";
import {CardInfo} from "./types";

/*メールを送る関数*/
export const sendMail = async (to: string, subject: string, body: string) : Promise<boolean> => {
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

export const client = axios.create({
    //baseURL: "http://192.168.0.200/",
    // baseURL: "http://connectouch.org/",
    timeout: 5000,
    withCredentials: false,
    validateStatus: _ => true,
    headers: {
        // Accept: "application/text/plain",
        // "Content-Type": "application/text/plain",
        "Content-Type": "application/x-www-form-urlencoded",
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

/*２つの文字列配列の中に共通するものがあるかbooleanで返す関数*/
export const isKeyWordContained = async (formerWords: Array<string>, latterWords: Array<string>): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        formerWords.forEach(word => {
            if (latterWords && latterWords.includes(word)) {
                resolve(true);
            }
        });
    });
};

/*カード番号からcardIDを解決する関数*/
export const resolveCardIdByNumber = async (cardNumber: number): Promise<string> => {
    return new Promise( async (resolve, reject) => {
        /*userCardTable.jsonを取得する*/
        const request = await get("http://192.168.0.200:3000/userCardTable.json", {});
        const cardTable = await request.data;
        console.dir(cardTable);
        const cardId = cardTable.find(card => {
            return card.number == cardNumber
        });
        resolve(cardId.id);
    });
};

/*参加者のプロフィールを取ってくる関数*/
export const getUserInfo = async (cardId : string):Promise<CardInfo> => {
    const endPointUrl = `http://192.168.0.200/info`;

    return new Promise( async (resolve, reject) => {
        //const response = await get(endPointUrl, {});
        const response = await fetch(endPointUrl);
        const infoLinks = await response.json() as Array<CardInfo>;

        const info =  infoLinks.find(item => {
            return item.id === cardId
        });
        resolve(info);
    });
};