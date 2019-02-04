
import * as React from "react";
import * as ReactDOM from "react-dom";
import axios, {AxiosResponse} from "axios";
import MainFrame from "./components/MainFrame";


window.onload = async () => {
    console.log("hello!");
    const json = await axios.get("osusume.json").catch(e => console.error(e)) as AxiosResponse;
    console.dir(json.data);
    ReactDOM.render((
        <MainFrame defaultState={{dataArray: json.data}}/>
    ),document.getElementById("root"));
};