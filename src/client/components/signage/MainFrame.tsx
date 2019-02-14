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
/*JSONを保存して格納する*/
// const osusumeList: Array<OsusumeJson> = [];

/*取得したlinksをローカルの配列として保持する*/
const storedLinks: Array<ConnecTouchLink> = [];

/*参加者情報のテーブルを取ってくる*/
const userInfoTable: Array<CardInfo> = [];

class MainFrame extends React.Component<{
    dataArray: Array<OsusumeJson>,
    readerId: string
},
    { osusumeList: Array<OsusumeJson>, readerId: string }> {

    constructor(props) {
        super(props);
        const {dataArray, readerId} = props;
        this.state = {
            osusumeList: dataArray,
            readerId: readerId
        }
    }

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
        const endPointUrl = `${endpoint}/links?id=${this.state.readerId}&limit=100`;
        const request = await axios.get(endPointUrl);
        const loadedLinks: Array<ConnecTouchLink> = request.data;
        /*新しく追加されたLinksを求める*/
        this.getDiff(storedLinks, loadedLinks);
        /*ローカルの配列を新しい配列に上書きする*/
        storedLinks.length = 0;
        Object.assign(storedLinks, loadedLinks);
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
                if (link.link[0] === this.state.readerId) {
                    console.log(`${link.link[1]}が私にタッチした!`);
                    const filteredList = await this.filterList(link.link[1], this.state.osusumeList);
                    console.dir(filteredList);
                    if (filteredList.length === 0) {
                        /*推薦するものが無ければ特に何もしない*/
                        console.log("推薦するものが無いので特に何もしない");
                    } else {
                        this.setState({osusumeList: filteredList});
                        console.dir(this.state);
                    }
                }
            })
        }

    };

    filterList = (id: string, osusumeList: OsusumeJson[]): Promise<OsusumeJson[]> => {
        const user = userInfoTable.find(item => {
            return item.id === id
        });
        const filteredList: OsusumeJson[] = [];
        osusumeList.forEach(async (shop) => {
            if (await isKeyWordContained(user.keywords, shop.keywords)) {
                filteredList.push(shop);
            }
        });

        return new Promise( (resolve, reject) => {
            resolve(filteredList);
        });
    };

    componentDidMount() {
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