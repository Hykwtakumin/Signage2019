import axios from "axios";
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


export { sendMail, isKeyWordContained }