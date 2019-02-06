import * as React from "react";
import axios, {AxiosResponse} from "axios";
import {css} from 'emotion'
import {CardInfo, ConnecTouchLink, OsusumeJson} from "../../share/types";
import {OsusumeGird} from "./OsusumeGrid";

const container = css({});

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

    componentDidMount() {
        /*JSONを保存して格納する*/
        let osusumeList : Array<OsusumeJson> = [];

        /*8番ラズパイのLinksを監視する*/
        const observeReaderId = "192.168.0.208";
        /*取得したlinksをローカルの配列として保持する*/
        let storedLinks : Array<ConnecTouchLink> = [];

        /*参加者情報のテーブルを取ってくる*/
        let userInfoTable : Array<CardInfo> = [];

        /*参加者のプロフィールを取ってくる関数*/
        const getUserInfo = async () => {
            const endPointUrl = `http://192.168.0.200/info`;

            // const request = await fetch(endPointUrl).catch(e => console.error(e));
            // const infoLinks : Response = await request.json();
            //
            // userInfoTable = infoLinks
            // console.dir(userInfoTable);

            const infoLinks = await axios.get(endPointUrl);

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