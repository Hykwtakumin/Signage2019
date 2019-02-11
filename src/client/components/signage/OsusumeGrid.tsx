import * as React from "react";
import {ReactDOM, ReactNode, SFC, FC} from "react";
import {OsusumeJson} from "../../../share/types";
import {css} from "emotion";

const gridContainer = css({
    display : "flex",
    flexDirection : "row",
    flexWrap : "wrap",
    justifyContent : "space-around",
    alignContent : "space-between"
});
const gridItem = css({
    textAlign : "center"
});
const gridImage = css({
    objectFit : "contain"
});

interface props {
    dataLists : Array<OsusumeJson>
}

export const OsusumeGird:FC<props> = ({dataLists}) => {

    dataLists.forEach((item) => {
            <div className={gridItem}>
                <h3>{item.title}</h3>
                <img className={gridImage} src={`img/${encodeURI(item.title)}.jpg`}/>
            </div>
    });

    return (
        <div className={gridContainer}>
            {{dataLists}}
        </div>
    );
};