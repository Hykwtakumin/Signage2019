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
        ReactDOM.render( <MobileApp/>, document.getElementById("root"))
    } else if (location.pathname.includes("signage")) {
        /*サイネージ用コンポーネントを読み込む*/
        const json = await axios.get("osusume.json").catch(e => console.error(e)) as AxiosResponse;
        console.dir(json.data);
        ReactDOM.render((
            <MainFrame dataArray={json.data} />
        ),document.getElementById("root"));
    }
};