import * as React from "react";
import * as ReactDOM from "react-dom";
import "antd/dist/antd.min.css";
import axios, {AxiosResponse} from "axios";
import MainFrame from "./components/signage/MainFrame";
import {MobileApp} from "./components/mobile/MobileApp";

window.onload = async () => {
    console.log("hello!");

    if (location.pathname.includes("mobile")) {
        /*モバイルページ用コンポーネントを読み込む*/
        ReactDOM.render(<MobileApp/>, document.getElementById("root"))
    } else {
        /*サイネージ用コンポーネントを読み込む*/
        const json = await axios.get("osusume.json").catch(e => console.error(e)) as AxiosResponse;
        console.dir(json.data);
        const place = decodeURI(location.pathname.replace("/", ""));
        console.log(`place:${place}`);
        let osusumeArray = [];
        let readerId : string;
        for (let item of json.data) {
            if (item.place === place) {
                osusumeArray.push(item)
            }
        }
        if (place === "大宮") {
            readerId = "192.168.0.210";
        } else if (place === "新宿") {
            readerId = "192.168.0.202";
        } else if (place === "秋葉原") {
            readerId = "192.168.0.217";
        } else if (place === "横浜") {
            readerId = "192.168.0.212";
        } else if (place === "藤沢") {
            /*本当はSFCのID*/
            readerId = "192.168.0.219";
        }

        ReactDOM.render((
          <MainFrame dataArray={osusumeArray} readerId={readerId} />
        ), document.getElementById("root"));
    }
};