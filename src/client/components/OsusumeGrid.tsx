import * as React from "react";
import {ReactDOM, ReactNode, SFC} from "react";
import {OsusumeJson} from "../../share/types";
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

export const OsusumeGird:SFC<{dataLists : Array<OsusumeJson>}> = props => {

    const dataLists = props.dataLists.forEach((item) => {
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