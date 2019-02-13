import * as React from "react";
import axios, {AxiosResponse} from "axios";
import {css} from 'emotion'
import {CardInfo, ConnecTouchLink, OsusumeJson} from "../../../share/types";
import {OsusumeGird} from "./OsusumeGrid";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;
import {isKeyWordContained, sendMail} from "../../../share/util";

const container = css({});

/*アクセスするサーバー*/
const endpoint = "http://192.168.0.200";

/*8番ラズパイのLinksを監視する*/
const observeReaderId = "192.168.0.208";
/*JSONを保存して格納する*/
// const osusumeList: Array<OsusumeJson> = [];

/*取得したlinksをローカルの配列として保持する*/
const storedLinks: Array<ConnecTouchLink> = [];

/*参加者情報のテーブルを取ってくる*/
const userInfoTable: Array<CardInfo> = [];

class MainFrame extends React.Component<{
    dataArray: Array<OsusumeJson>
},
  { osusumeList: Array<OsusumeJson> }> {

    constructor(props) {
        super(props);
        const {dataArray} = props;
        this.state = {
            osusumeList: dataArray
        }
    }

    /*おすすめリストを保持しておく関数*/
    /*最初に実行する*/
    // storeOsusumeList = async () => {
    //     Object.assign(osusumeList , this.props.dataArray);
    // };

    /*参加者のプロフィールを取ってくる関数*/
    getUserInfo = async () => {
        const endPointUrl = `${endpoint}/info`;

        const response = await axios.get(endPointUrl);
        const infoLinks = response.data as Array<CardInfo>;

        infoLinks.forEach(item => {
            userInfoTable.push(item);
        });
    };

    pollingLinks = async () => {
        /*192.168.0.200/linksから紐付いたlinksを取得する*/
        /*Paramsにidを追加しない場合全てのリーダーのイベントを取得できる*/
        const endPointUrl = `${endpoint}/links?id=${observeReaderId}&limit=100`;
        const request = await axios.get(endPointUrl);
        const loadedLinks: Array<ConnecTouchLink> = request.data;
        /*新しく追加されたLinksを求める*/
        this.getDiff(storedLinks, loadedLinks);
        /*ローカルの配列を新しい配列に上書きする*/
        storedLinks.length = 0;
        Object.assign(storedLinks, loadedLinks);
    };

    notificate = (message: string) => {
        // // ブラウザが通知をサポートしているか確認する
        // if (!("Notification" in window)) {
        //     alert("このブラウザはシステム通知をサポートしていません");
        // }
        //
        // // すでに通知の許可を得ているか確認する
        // else if (Notification.permission === "granted") {
        //     // 許可を得ている場合は、通知を作成する
        //     new Notification(message);
        // }
        //
        // // 許可を得ていない場合は、ユーザに許可を求めなければならない
        // else if (Notification.permission !== 'denied') {
        //     Notification.requestPermission(function (permission) {
        //         // ユーザが許可した場合は、通知を作成する
        //         if (permission === "granted") {
        //             new Notification(message);
        //         }
        //     });
        // }
        // Notification.requestPermission(function(result) {
        //     if (result === 'granted') {
        //         navigator.serviceWorker.ready.then(function(registration) {
        //             registration.showNotification(`Notification with ServiceWorker : ${message}`);
        //         });
        //     }
        // });
    };

    getDiff = (oldLinks: Array<ConnecTouchLink>, newLinks: Array<ConnecTouchLink>) => {
        /*newLinksにあってoldLinksに無いものは新しいものとする*/
        /*あるかないかの確認はmongoDBのレコードIdを元に行う*/
        const oldIdArray = oldLinks.map(link => link._id.$oid);

        /*レコードIdを元に存在しているかを真偽値で返す関数*/
        const isContained = (link) => {
            return oldIdArray.includes(link._id.$oid);
        };

        /*newLinksにあってoldLinksに無いものだけを集めた配列を作る*/
        const diffLinks = newLinks.reduce((prev, curr) => {
            if (!isContained(curr)) {
                prev.push(curr)
            }
            return prev
        }, []);

        if (diffLinks.length != 0 && diffLinks.length < 2) {
            console.log(`新しいタッチイベントが${diffLinks.length}件発生しました!`);
            /*例えば自分が1番の場合は監視するフィルタも作れる*/
            diffLinks.forEach(async link => {
                /*リーダーIDが自分のIDと一致する場合*/
                if (link.link[0] === observeReaderId) {
                    console.log(`${link.link[1]}が私にタッチした!`);
                    const filteredList = await this.filterList(link.link[1]);
                    console.dir(filteredList);
                    if (filteredList.length === 0) {
                        /*推薦するものが無ければ特に何もしない*/
                    } else {
                        this.setState({osusumeList: filteredList});
                        console.dir(this.state);
                        this.notificate("新しいタッチイベントを検出しました!");
                        // sendMail("user4@192.168.0.200", "テストです", `${filteredList.toString()}`)
                        //     .then(response => {
                        //         if (response) {
                        //             console.log("メールの送信に成功しました!");
                        //         } else {
                        //             console.log("メールの送信に失敗しました...");
                        //         }
                        //     })
                        //     .catch(error => {
                        //         console.error(error);
                        //     });
                    }
                }
            })
        }

    };

    filterList = async (id: string): Promise<OsusumeJson[]> => {
        const user = userInfoTable.find(item => {
            return item.id === id
        });

        const userFavWords = user.keywords;
        console.dir(userFavWords);

        // const filteredShopList: Array<OsusumeJson> = osusumeList.map(async (item: OsusumeJson) => {
        //     const filtered = Promise.all(osusumeList.map(item => {
        //         return new Promise(async (resolved, rejected)=>{
        //             if (await isKeyWordContained(userFavWords, item.keywords)) {
        //                 resolved(item);
        //                 // return item
        //             }
        //         })
        //     }));
        // if (await isKeyWordContained(userFavWords, item.keywords)) {
        //     return item
        // }
        // });

        /*生成したものを返す*/
        // return new Promise((resolve, reject) => {
        //     resolve(filteredShopList);
        // });
        return []//osusumeList
        // if(await isKeyWordContained(userFavWords, osusumeList[0].keywords)){
        //     return osusumeList[0];
        // }
        // return Promise.all(osusumeList.map(item => {
        //     return new Promise(async (resolved, rejected) =>{
        //         if (await isKeyWordContained(userFavWords, item.keywords)) {
        //             resolved(item as OsusumeJson);
        //             // return item
        //         }
        //     })
        // }));
    };

    registerServiceWorker = () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registered => {
              console.log('SW registered!', registered);
          })
          .catch(error => {
              console.error(error);
          });
    };

    componentDidMount() {
        /*workerを登録*/
        this.registerServiceWorker();
        /*オリジナルのOsusumeJsonを確保*/
        // this.storeOsusumeList();
        /*参加者のプロフィールを取得する*/
        this.getUserInfo();
        setInterval(() => {
            this.pollingLinks();
        }, 1000);
    }

    render() {
        const place = `${decodeURI(location.pathname).replace("/", "")}駅`;
        return (
          <div className={container}>
              <h1>{place}のおすすめ情報</h1>
              <OsusumeGird dataLists={this.state.osusumeList}/>
          </div>
        );
    }
}

export default MainFrame;