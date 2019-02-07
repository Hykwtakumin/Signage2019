import * as React from "react";
import axios, {AxiosResponse} from "axios";
import {css} from 'emotion'
import {CardInfo, ConnecTouchLink, OsusumeJson} from "../../share/types";
import {OsusumeGird} from "./OsusumeGrid";

const container = css({});

/*8番ラズパイのLinksを監視する*/
const observeReaderId = "192.168.0.208";
/*JSONを保存して格納する*/
let osusumeList : Array<OsusumeJson> = [];

/*取得したlinksをローカルの配列として保持する*/
let storedLinks : Array<ConnecTouchLink> = [];

/*参加者情報のテーブルを取ってくる*/
let userInfoTable : Array<CardInfo> = [];

 class MainFrame extends React.Component<{
     dataArray : Array<OsusumeJson>
 }> {

    constructor(props) {
        super(props);
        const {dataArray} = props;
        this.state = {
            dataArray : dataArray
        }
    }

    pollingLinks = async () => {
        /*192.168.0.200/linksから紐付いたlinksを取得する*/
        /*Paramsにidを追加しない場合全てのリーダーのイベントを取得できる*/
        const endPointUrl = `http://192.168.0.200/links?id=${observeReaderId}&limit=100`;
        const request = await axios.get(endPointUrl);
        const loadedLinks : Array<ConnecTouchLink> = request.data;
        /*新しく追加されたLinksを求める*/
        //getDiff(storedLinks, loadedLinks)
        /*ローカルの配列を新しい配列に上書きする*/
    };

     getDiff = (oldLinks : Array<ConnecTouchLink>, newLinks : Array<ConnecTouchLink>) => {
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
                     // const filteredList = await this.filterList(link.link[1]);
                     // console.dir(filteredList);
                     // if (filteredList.length === 0) {
                     //     /*推薦するものが無ければすべて表示する*/
                     //     renderGrid(osusumeList);
                     // } else {
                     //     renderGrid(filteredList);
                     // }
                 }
                 /*ここでListを絞り込んだ上でLinkを描画する*/
             })
         }

     };

    filterList = async (id : string, userInfoTable : Array<CardInfo>, osusumeList : Array<OsusumeJson>) : Promise<Array<OsusumeJson>> => {
        const user = userInfoTable.find( item => {
            return item.id === id
        });

        const userFavWords = user.keywords;
        console.dir(userFavWords);

        /*userFavWords内の単語があるかどうか調べる*/
        const isContained = (list) => {
            return new Promise((resolve, reject) => {
                userFavWords.forEach( async (item : string) => {
                    if (list.includes(item)) {
                        resolve(true);
                    }
                } );
            });
        };

        const favShops : Array<OsusumeJson> = [];

        osusumeList.forEach(async (item : OsusumeJson) => {
            if (await isContained(item.keywords)) {
                console.log(`keyword detected! : ${item.title}`);
                favShops.push(item);
            }
        });

        /*生成したものを返す*/
        return new Promise((resolve, reject) => {
            resolve(favShops);
        });
    };

    componentDidMount() {

        /*参加者のプロフィールを取ってくる関数*/
        const getUserInfo = async () => {
            const endPointUrl = `http://192.168.0.200/info`;

            // const request = await fetch(endPointUrl).catch(e => console.error(e));
            // const infoLinks : Response = await request.json();
            //
            // userInfoTable = infoLinks
            // console.dir(userInfoTable);

            const response = await axios.get(endPointUrl);
            const infoLinks = response.data as Array<CardInfo>;

            infoLinks.forEach(item => {
                userInfoTable.push(item);
            });

            //userInfoTable.push([..infoLinks])

        };

    }

    render() {
        return (
            <div className={container}>
                <h1>ConnecTouch Signage</h1>
                <OsusumeGird dataLists={this.props.dataArray}/>
            </div>
        );
    }
}

export default MainFrame;